import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-login-project4',
  templateUrl: './login-project4.component.html',
  styleUrls: ['./login-project4.component.css']
})
export class LoginProject4Component implements OnInit {

  public orderArr = <any>([]);
  public info = <any>({});
  public Totalproducts = <any>([]);
  public Totalorders = <any>([]);
  public UserName: any;
  public Password: any;
  public LastDate = <any>([]);
  public uid: any;
  public lastdate: any;
  public lasthour: any;

  public Info = {
    username: "",
    password: ""
  }


  constructor(public api: ApiService, private router: Router) {
    let Session = sessionStorage.getItem('mail') //=================Check if session email connected
    console.log("session = ", Session)
    if (Session == null) {
      this.router.navigate([""])
    }

    this.UserName = JSON.parse(localStorage.UserName)
    this.Password = JSON.parse(localStorage.Password)
    this.uid = JSON.parse(localStorage.UserId)
    this.Info.username = this.UserName;
    this.Info.password = this.Password;
  }

  async ngOnInit() {
    this.Totalproducts = await this.api.getInfoFromServer("getProducts");//======= bring products number
    this.Totalorders = await this.api.getInfoFromServer1("getOrders");//=======bring orders to check shipping date 
    this.LastDate = await this.api.getLastDate("LastDate", this.uid);//======= bring last purchase date for user

    this.lastdate = this.Totalorders[0].order_finished.slice(0, 10)
    this.lasthour = this.LastDate[0].order_finished.slice(12, 23)


  }

  async Login() {
    if (this.Info.username === "" || this.Info.password === "") {
      console.log("location.reload")
      location.reload();
    }
    this.info = await this.api.CheckLogin(this.Info); //============= check if user exist admin/not
    console.log("User info from server = ", this.info)
    this.api.setOrder(this.uid)
    this.router.navigate(['HomeuserComponent'])
  }
  Regester() {
    this.router.navigate(['RegesterComponent'])
  }
}
