import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

export interface IUserForm {
  username: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  userForm: FormGroup;
  formError: boolean = false
  constructor(private userService: UserService, private router: Router) {
    this._createForm()
  }
  _createForm() {
    this.userForm = new FormGroup({
      username: new FormControl<string>(''),
      password: new FormControl<string>('')
    })
  }
  ngOnInit(): void {

  }
  login(values: IUserForm) {
    this.userService.login(values).subscribe(
      val=>{
        console.log(val)
        localStorage.setItem('JWT', val.access)
        localStorage.setItem('JWTRefresh', val.refresh)
        this.router.navigateByUrl('')
      },
      err=> {
        console.log(err)
        this.formError = true;
      }
    )
  }

  onSubmit() {
    this.login(this.userForm.value)
    console.log(this.userForm.value)
  }

  vkLogin() {
    window.location.href = 'https://oauth.vk.com/authorize?client_id=8107100&display=popup&response_type=code&scope=12&redirect_uri=http://localhost:4200/vk&v=5.131'
  }
}
