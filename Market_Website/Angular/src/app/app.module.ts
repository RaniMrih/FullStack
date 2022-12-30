import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginProjectComponent } from './login-project/login-project.component';
import { LoginProject2Component } from './login-project2/login-project2.component';
import { LoginProject3Component } from './login-project3/login-project3.component';
import { LoginProject4Component } from './login-project4/login-project4.component';
import { RegesterComponent } from './regester/regester.component';
import { HomeuserComponent } from './homeuser/homeuser.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { CardComponent } from './card/card.component';
import { CartComponent } from './cart/cart.component';
import { CardAdminComponent } from './card-admin/card-admin.component';
import { ModalComponent } from './modal/modal.component';
import { ModalimageComponent } from './modalimage/modalimage.component';
import { ModalproductComponent } from './modalproduct/modalproduct.component';
import { Cart2Component } from './cart2/cart2.component';
import { FinishComponent } from './finish/finish.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginProjectComponent,
    RegesterComponent,
    HomeuserComponent,
    HomeadminComponent,
    CardComponent,
    CartComponent,
    CardAdminComponent,
    ModalComponent,
    ModalimageComponent,
    ModalproductComponent,
    Cart2Component,
    LoginProject2Component,
    LoginProject3Component,
    LoginProject4Component,
    FinishComponent,
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
