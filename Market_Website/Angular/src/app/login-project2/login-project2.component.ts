import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-login-project2',
  templateUrl: './login-project2.component.html',
  styleUrls: ['./login-project2.component.css']
})
export class LoginProject2Component implements OnInit {
  public orderArr = <any>([]);
  public info = <any>({});
  public Totalproducts = <any>([]);
  public Totalorders = <any>([]);
  public UserName: any;
  public Password: any;
  public uid: any;
  public NewOrderId = <any>([]);
  public LastDate = <any>([]);
  public Info = {
    username: "",
    password: "",
  }
  // =============================================================== constructor ============================================== -->

  constructor(public api: ApiService, private router: Router) {
    let Session = sessionStorage.getItem('mail')//=================Check if session email connected
    if (Session == null) {
      this.router.navigate([""])
    }
    this.UserName = JSON.parse(localStorage.UserName)
    this.Password = JSON.parse(localStorage.Password)
    this.uid = JSON.parse(localStorage.UserId)
  }
  // =============================================================== ngOnInit ============================================== -->
  async ngOnInit() {
    this.Totalproducts = await this.api.getInfoFromServer("getProducts");//======= bring products number
    this.Totalorders = await this.api.getInfoFromServer1("getOrders");//========== bring orders number
    this.LastDate = await this.api.getLastDate("LastDate", this.uid);//=========== bring last purchase date 
    localStorage.OrderId = JSON.stringify(this.LastDate[0].order_id)//============ set new Order Id to localstorage
    this.api.orderId = this.LastDate[0].order_id//================================ set api orderId
  }

  Login() {
    if (this.LastDate == "") {
      this.api.setOrder(this.uid)
    }
    this.router.navigate(['HomeuserComponent'])
  }

  Regester() {
    this.router.navigate(['RegesterComponent'])
  }
}
