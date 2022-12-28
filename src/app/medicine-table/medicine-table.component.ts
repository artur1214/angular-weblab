import {Component, Inject, Input, OnInit} from '@angular/core';
import {IMedicine, IMedicineView} from "../models/medicine";
import {keys} from "ts-transformer-keys";
import {MedicineService} from "../services/medicine.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as http from "http";

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
    if (id !== -1){
      this.currentMedicine = this.medicines.filter(val => val.id == id)[0]
    }
    else{
      this.currentMedicine = {model: "", name: "", price: "0", type: this.medicineTypes[0]?.[0]}
    }
    this.openDialog()
  }

  deleteRow(id: number) {
    this.medicineService.delete(id).subscribe(() => {
      this._getMedicineInfo()
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MedicineEditDialog, {
      width: '480px',
      data: {
        types: this.medicineTypes,
        selectedMedicine: Object.assign({}, this.currentMedicine)
      },
    });

    dialogRef.afterClosed().subscribe((result:IMedicine) => {
      console.log('The dialog was closed');
      console.log(result)
      if(result.id === undefined) {
        this.medicineService.create(result).subscribe((created: IMedicine)=>{
          this.medicines = [...this.medicines, created]
        })
      }
      else {
        this.medicineService.patch(result.id, result).subscribe((value: IMedicine) => {
          this.medicines.map((val, index) => {
            if (val.id != value.id) {
              return;
            }
            this.medicines[index] = {...value}
          })
          this.medicines = [...this.medicines]
        })
      }
    });
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

@Component({
  selector: 'medicine-dialog',
  templateUrl: 'edit-dialog.html',
  styleUrls: ['edit-dialog.css']
})
export class MedicineEditDialog {
  constructor(
    public dialogRef: MatDialogRef<MedicineEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedMedicine: IMedicine, types: [number, string][] },
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
