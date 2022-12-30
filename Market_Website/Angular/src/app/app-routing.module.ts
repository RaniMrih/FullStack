import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginProjectComponent } from './login-project/login-project.component';
import { LoginProject2Component } from './login-project2/login-project2.component';
import { LoginProject3Component } from './login-project3/login-project3.component';
import { LoginProject4Component } from './login-project4/login-project4.component';
import { RegesterComponent } from './regester/regester.component';
import { HomeuserComponent } from './homeuser/homeuser.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { Cart2Component } from './cart2/cart2.component';
import { FinishComponent } from './finish/finish.component';

const routes: Routes = [
  { path: '', component: LoginProjectComponent },
  { path: 'Loginproject2Component', component: LoginProject2Component },
  { path: 'Loginproject3Component', component: LoginProject3Component },
  { path: 'Loginproject4Component', component: LoginProject4Component },
  { path: 'RegesterComponent', component: RegesterComponent },
  { path: 'HomeuserComponent', component: HomeuserComponent },
  { path: 'HomeadminComponent', component: HomeadminComponent },
  { path: 'Cart2Component', component: Cart2Component },
  { path: 'FinishComponent', component: FinishComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
