import {Component, Inject, Input, OnInit} from '@angular/core';
import {IMedicine, IMedicineFormError, IMedicineView} from "../models/medicine";
import {keys} from "ts-transformer-keys";
import {MedicineService} from "../services/medicine.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as http from "http";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-medicine-table',
  templateUrl: './medicine-table.component.html',
  styleUrls: ['./medicine-table.component.css']
})
export class MedicineTableComponent implements OnInit {

  constructor(private medicineService: MedicineService, private router: Router, public dialog: MatDialog) {
  }

  @Input() medicines: IMedicine[] = []
  @Input() medicineTypes: [number, string][] = []
  columns: (keyof IMedicine | string)[] = ['id', 'name', 'type', 'price', 'model', 'buttons']
  currentMedicine: IMedicine

  ngOnInit(): void {
    this.medicineService.getAllTypes().subscribe((types) => {
      this.medicineTypes = types;
      this.currentMedicine = {model: "", name: "", price: "", type: types[0][0] || 1}
    }, (error) => {
      //this.router.navigateByUrl('login');
    })
    this._getMedicineInfo()

  }

  _getMedicineInfo() {
    this.medicineService.getAll().subscribe((medicine) => {
      this.medicines = medicine//.map((value) => {
      //return {...value, type: (this.medicineTypes.filter(val => val[0] == value.type))[0][1]}
      // });
    })
  }

  changeRow(id: number) {
    console.log(id)
    if (id !== -1) {
      this.currentMedicine = this.medicines.filter(val => val.id == id)[0]
    } else {
      this.currentMedicine = {model: "", name: "", price: "0", type: this.medicineTypes[0]?.[0]}
    }
    this.openDialog()
  }

  deleteRow(id: number) {
    this.medicineService.delete(id).subscribe(() => {
      this._getMedicineInfo()
    })
  }

  openDialog(errors?: IMedicineFormError): void {
    console.log('errr', errors)
    const dialogRef = this.dialog.open(MedicineEditDialog, {
      width: '480px',
      data: {
        types: this.medicineTypes,
        selectedMedicine: Object.assign({}, this.currentMedicine),
        errors: errors || {}
      },
    });

    dialogRef.afterClosed().subscribe((result: { value: IMedicine, created: boolean }) => {
      console.log('res', result)
      if (result.created) {
        this.medicines = [...this.medicines, result.value]
      } else {
        this.medicines.map((val, index) => {
          if (val.id != result.value.id) {
            return;
          }
          this.medicines[index] = {...result.value}
        })
        this.medicines = [...this.medicines]
      }

    })
  }

  getMedicineTypeName(typeId: number) {
    return this.medicineTypes.filter(val => val[0] == typeId)[0][1]
  }

  signOut() {
    localStorage.removeItem('JWT');
    localStorage.removeItem('JWTRefresh');
    location.reload();
  }
}

interface IDialogData {
  selectedMedicine: IMedicine,
  types: [number, string][],
  errors: IMedicineFormError
}

@Component({
  selector: 'medicine-dialog',
  templateUrl: 'edit-dialog.html',
  styleUrls: ['edit-dialog.css']
})


export class MedicineEditDialog {
  @Input() _data: IDialogData
  @Input() show: boolean;

  constructor(
    public dialogRef: MatDialogRef<MedicineEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private medicineService: MedicineService
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this._data = {...this.data}
    this.show = true
  }

  validate() {
    this.show = !this.show
    console.log('validated')
    const result = {...this.data.selectedMedicine}
    console.log(result)
    if (result.id === undefined) {
      this.medicineService.create(result).subscribe({
        next: (created: IMedicine) => {
          this.dialogRef.close({value: created, created: true});
        },
        error: (err: { error: IMedicineFormError }) => {
          this.dialogRef.componentInstance.data = {...this.data, errors:err.error }
        }
      })
    } else {
      this.medicineService.patch(result.id, result).subscribe({
        next: (value: IMedicine) => {
          this.dialogRef.close({value: value, created: false})
        },
        error: (err) => {
          this.dialogRef.componentInstance.data = {...this.data, errors: err.error }
        }
      })
    }

  }
}
