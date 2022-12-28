import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-vklogin',
  templateUrl: './vklogin.component.html',
  styleUrls: ['./vklogin.component.css']
})
export class VKLoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.vkLogin(window.location.href.split('?')[1] || '').subscribe(((val)=>{
      localStorage.setItem('JWT', val.access)
      localStorage.setItem('JWTRefresh', val.refresh)
      this.router.navigateByUrl('')
    }))
    this.activatedRoute.queryParams.subscribe()
  }

}
