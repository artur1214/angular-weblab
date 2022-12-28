import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicineTableComponent } from './medicine-table/medicine-table.component';
import {LoginComponent} from "./login/login.component";
import {VKLoginComponent} from "./vklogin/vklogin.component";     // Add your component here
//import { AboutComponent } from './about/about.component';  // Add your component here

const routes: Routes = [
  {
    path: '',
    component: MedicineTableComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'vk',
    component: VKLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
