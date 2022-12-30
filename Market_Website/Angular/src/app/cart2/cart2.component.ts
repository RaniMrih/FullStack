import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-cart2',
  templateUrl: './cart2.component.html',
  styleUrls: ['./cart2.component.css']
})
export class Cart2Component implements OnInit {
  cartArray = <any>([])
  public UserId = <any>("");
  public orderId: number = 0;
  public UserName: any;
  public Totalorders = <any>([]);
  public counter = 0;
  public Info2 = {
    city: "",
    street: "",
    shipping_date: "",
    payment: "",
    date: "",
  }
  public Info = {
    product: "",
  }
  // ===============================================constructor=========================================================
  constructor(public api: ApiService, private router: Router) {
    let Session = sessionStorage.getItem('mail')//=================Check if session email connected
    if (Session == null) {
      this.router.navigate([""])
    }
    this.orderId = localStorage.OrderId;
    this.UserId = localStorage.Userid;
    this.UserName = JSON.parse(localStorage.UserName)
    this.fillcart()
  }
  // ===============================================ngOnInit=========================================================
  async ngOnInit() { }
  // ===============================================fillcart final cart===============================================
  async fillcart() {
    this.cartArray = await this.api.fillcart(this.api.orderId); //===== Cart to display
  }
  // =================================================================================================================
  async FinishOrder() {
    var y = new Date()
    var y2 = y.getMonth() + 1
    var y1 = 2019 + "-" + y2 + "-" + y.getDate(); //==== date to compare
    var d = new Date().toLocaleString();

    if (this.Info2.city == "" || this.Info2.street == "" || this.Info2.shipping_date == "" || this.Info2.payment == "") {
      alert("All fields are mandatory")
    }
    else {
      let OK = true;
      this.Totalorders = await this.api.getInfoFromServer1("getOrders");//=======bring orders to check shipping date 

      for (let item of this.Totalorders) {
        if (item.shipping_date.slice(0, 10) == this.Info2.shipping_date) { //== count oders in shipping date
          this.counter += 1;
        }
      }
      if (this.Info2.shipping_date < y1) {
        document.getElementById("ShippingCheck").classList.toggle('active');//====red input for past date
        alert("please change shipping date, Can't choose past date")
        OK = false;
      }
      if (this.counter >= 3) {
        document.getElementById("ShippingCheck").classList.toggle('active');//====red input for 3 shipping in this date
        alert("please change shipping date, we alrady have 3 orders")
        OK = false;
        this.counter = 0;
      }
      if (OK == true) {
        this.Info2.date = d;
        this.api.FinishOrder(this.Info2);//== finish the order
        this.cartArray = "";
        this.api.sum = 0;
        this.api.arr = ""
        this.router.navigate(["FinishComponent"]) //== navigate to finish component
      }
    }
  }
  // ========================================================================================================
  backtohomeuser() {
    this.router.navigate(['HomeuserComponent']) //== navigate back to homeuser component
  }
}