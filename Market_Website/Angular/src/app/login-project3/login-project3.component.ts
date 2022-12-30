import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
// import { Alert } from 'selenium-webdriver';
import { Router } from "@angular/router"


@Component({
  selector: 'app-login-project3',
  templateUrl: './login-project3.component.html',
  styleUrls: ['./login-project3.component.css']
})
export class LoginProject3Component implements OnInit {
  public orderArr = <any>([]);
  public info = <any>({});
  public Totalproducts = <any>([]);
  public Totalorders = <any>([]);
  public UserName: any;
  public Password: any;
  public LastDate = <any>([]);
  public uid: any;
  public total: any;

  public Info = {
    username: "",
    password: "",
  }

  constructor(public api: ApiService, private router: Router) {
    let Session = sessionStorage.getItem('mail')//=================Check if session email connected
    if (Session == null) {
      this.router.navigate([""])
    }
    this.UserName = JSON.parse(localStorage.UserName)
    this.Password = JSON.parse(localStorage.Password)
    this.uid = JSON.parse(localStorage.UserId)
  }

  async ngOnInit() {
    this.Totalproducts = await this.api.getInfoFromServer("getProducts");//======= bring products number
    this.Totalorders = await this.api.getInfoFromServer1("getOrders");//======= bring orders number
    this.LastDate = await this.api.CheckOpenOrder(this.uid);//======= bring last purchase date 
    for (let item of this.LastDate) {
      // console.log("LastDate = ", this.LastDate)
      if (item.finish == 0) {
        this.LastDate = item.order_started.slice(0, 10)
        this.total = item.total_price;
        this.api.sum = item.total_price;
      }
    }
  }

  async Login() {
    this.info = await this.api.CheckLogin(this.Info); //============= check if user exist admin/not
    this.router.navigate(['HomeuserComponent'])
  }
  Regester() {
    this.router.navigate(['RegesterComponent'])
  }
}