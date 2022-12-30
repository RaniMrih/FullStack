import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginProjectComponent } from './login-project/login-project.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { UserNotAdminComponent } from './user-not-admin/user-not-admin.component';
import { DeadServersComponent } from './dead-servers/dead-servers.component';
import { MtusbsListComponent } from './mtusbs-list/mtusbs-list.component';



const routes: Routes = [
  { path: '', component: LoginProjectComponent },
  { path: 'HomeadminComponent', component: HomeadminComponent },
  { path: 'UsernotadminComponent', component: UserNotAdminComponent },
  { path: 'DeadserversComponent', component: DeadServersComponent },
  { path: 'MtusbslistComponent', component: MtusbsListComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
