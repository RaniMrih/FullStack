import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-regester',
  templateUrl: './regester.component.html',
  styleUrls: ['./regester.component.css']
})
export class RegesterComponent implements OnInit {
  UserName = "";


  Info1 = {
    username: "",
    mail: "",
    password: ""
  }

  Info2 = {
    city: "",
    street: "",
    name: "",
    lastname: ""
  }

  Confirm = {
    password: "",
  }
  public step1 = false;

  constructor(public api: ApiService, private router: Router) { }

  ngOnInit() {
  }
  // ========================================= Regester1 ==============================================================

  async Regester1() {
    let Users: any = await this.api.GetUsers();
    console.log("All users===", Users)
    let MailOK = true;
    let UserOK = true;
    let PasswordOK = true;
    if (this.Info1.username == "" || this.Info1.mail == "" || this.Info1.password == "") {
      alert("Please fill all fields")
    }
    else {

      for (let item of Users) {
        if (item.mail === this.Info1.mail) {
          document.getElementById("EmailCheck").classList.toggle('active');//====Check if mail exist in DB
          MailOK = false;
          document.getElementById("demo").innerHTML = "Paragraph changed!";
          // console.log("All OK")
        }
        if (item.user_name === this.Info1.username) {
          document.getElementById("UserCheck").classList.toggle('active');//====Check if userName exist in DB
          alert("This User name  exists, please change it")
          UserOK = false;
        }
      }
      if (this.Info1.password !== this.Confirm.password) {

        document.getElementById("PasswordCheck").classList.toggle('active');//====Check if password confirmed
        alert("Password is not idintical")
        PasswordOK = false;
      }

      if (MailOK == true && UserOK == true && PasswordOK == true) {
        this.step1 = true
        const info = await this.api.Regester1(this.Info1);
        let info2: any = await this.api.CheckLogin(this.Info1); //======== check if user exist Admin / not Admin
        console.log("info2 ===", info2)
        sessionStorage.setItem('mail', info2.mail)
        sessionStorage.setItem('user', info2.user_name)
        localStorage.UserId = JSON.stringify(info2.id) //============== localstorage User Id
        localStorage.UserName = JSON.stringify(info2.user_name)
        localStorage.Password = JSON.stringify(info2.password)
        console.log("All OK")

      }
    }
  }
  // =======================================================================================================
  async Regester2() {
    const info2 = await this.api.Regester2(this.Info2);

    this.router.navigate(['Loginproject2Component'])

  }
  toggleStep1() {
    this.step1 = false;
    // document.getElementById("box").classList.toggle('box');
  }
}
