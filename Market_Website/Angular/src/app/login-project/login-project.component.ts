import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-login-project',
  templateUrl: './login-project.component.html',
  styleUrls: ['./login-project.component.css']
})
export class LoginProjectComponent implements OnInit {
  public orderArr = <any>([]);
  public info = <any>({});
  public Totalproducts = <any>([]);
  public Totalorders = <any>([]);


  public Info = {
    username: "",
    password: "",
  }
  // ========================================================== construcror =======================================================
  constructor(public api: ApiService, private router: Router) {
    localStorage.clear()
    sessionStorage.removeItem('mail')
    sessionStorage.removeItem('user')
  }
  // ========================================================== ngOnInit ==========================================================
  async ngOnInit() {
    this.Totalproducts = await this.api.getInfoFromServer("getProducts");//============bring products for Cards
    this.Totalorders = await this.api.getInfoFromServer1("getOrders");//===============bring orders number  
  }
  // ================================================== After press submit CheckLogin ============================================================

  async CheckLogin() {
    this.info = await this.api.CheckLogin(this.Info); //======== check if user exist Admin / not Admin

    if (this.info.results === "Admin User") {
      localStorage.UserId = JSON.stringify(this.info.id)
      localStorage.UserName = JSON.stringify(this.info.user_name)
      sessionStorage.setItem('mail', this.info.mail)
      sessionStorage.setItem('user', this.info.user_name)
      this.router.navigate(['HomeadminComponent'])

    }
    if (this.info.results === "Not Admin") {
      localStorage.UserId = JSON.stringify(this.info.id) //============== localstorage User Id
      localStorage.UserName = JSON.stringify(this.info.user_name)
      localStorage.Password = JSON.stringify(this.info.password)
      this.orderArr = await this.api.CheckOpenOrder(this.info.id) //===== check open orders in api
      if (this.orderArr == "") //=============================== if no open order go to set order and route to home
      {
        this.api.setOrder(this.info.id)
        sessionStorage.setItem('mail', this.info.mail)
        sessionStorage.setItem('user', this.info.user_name)
        this.router.navigate(['Loginproject2Component'])//===== יוזר רשום אך קניה ראשונה
      }
      else {
        let OpenOrder = false;
        for (let item of this.orderArr) {
          if (item.finish == 0) {
            OpenOrder = true;
            localStorage.OrderId = JSON.stringify(item.order_id)//========================= if exist open order set to local storage and route to home
            this.api.orderId = item.order_id//========================= set api orderId
            sessionStorage.setItem('mail', this.info.mail)
            sessionStorage.setItem('user', this.info.user_name)
            this.router.navigate(['Loginproject3Component'])//====== יוזר רשום והקניה עדיין פתוחה
          }
        }
        if (OpenOrder == false) {
          sessionStorage.setItem('mail', this.info.mail)//====== יוזר רשום וההזמנה האחרונה סגורה
          sessionStorage.setItem('user', this.info.user_name)
          this.router.navigate(['Loginproject4Component'])
        }
      }

    }
    if (this.info.results === "NotRegestered") //================================================= if no regestred user alert
    {
      alert("Not regestered User")
    }
    const info1 = await this.api.StartSession(this.info); //======================================= Session 
    console.log("Results after session =", info1);
  }
}
