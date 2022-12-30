import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginProjectComponent } from './login-project/login-project.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { UserNotAdminComponent } from './user-not-admin/user-not-admin.component';
import { DeadServersComponent } from './dead-servers/dead-servers.component';
import { MtusbsListComponent } from './mtusbs-list/mtusbs-list.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginProjectComponent,
    HomeadminComponent,
    UserNotAdminComponent,
    DeadServersComponent,
    MtusbsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
