import { Component, OnInit, Input } from '@angular/core';
// import { CartService } from '../services/cart.service';
import { ApiService } from '../api.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from "@angular/router"

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {
  public UserName: any;



  constructor(public api: ApiService, private router: Router) {
    let Session = sessionStorage.getItem('mail')//=================Check if session email connected
    if (Session == null) {
      this.router.navigate([""])
    }
    this.UserName = JSON.parse(localStorage.UserName)
    localStorage.removeItem("OrderId");

  }

  ngOnInit() {
  }
  backtoLogin4() {
    this.router.navigate(['Loginproject4Component'])

  }

}
