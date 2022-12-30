import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from "@angular/router"

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cart1 = new BehaviorSubject<any>([]);
  public cart2 = <any>([]);
  public UserId = <any>("");
  public orderId: number = 0;
  public LastDate = <any>([]);

  constructor(public api: ApiService, private router: Router) {
    this.cart1 = api.cart;
    api.cart.subscribe(data => {
      this.cart1 = data;
    })
    this.orderId = localStorage.OrderId;
    this.UserId = localStorage.Userid;
  }
  async ngOnInit() {
  }

  async FinishOrder() {
    console.log(this.api.cart.value)
    if (this.api.cart.value == "") {
      alert("Your cart is empty")
    }
    else {
      this.router.navigate(['Cart2Component'])
    }
  }
  deleteFromCart(event) {
    // console.log("event= ", event)
    if (event.productId) {
      // console.log("event contains productID")
      this.api.deleteFromCart(event.productId, event.price, event.quantity, "WithPId")
    }
    else {
      // console.log("event contains id")
      this.api.deleteFromCart(event.id, event.price, event.quantity, "NoPId")
    }


  }

  deleteOrder() {
    this.api.deleteorder("deleteorder")//==delete all the order products
    this.api.fillcart(this.orderId)//======fill new cart
    this.api.sum = 0;
    this.api.UpdateTotalPrice();//=========update DB price to 0


  }

}
