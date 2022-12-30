import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-homeuser',
  templateUrl: './homeuser.component.html',
  styleUrls: ['./homeuser.component.css']
})
export class HomeuserComponent implements OnInit {
  public NewOrderId = <any>([]);
  uid: any;
  products: any;
  cart: any;
  UserName: any;
  cat: any = [];
  flag: any = 0;
  public flag1: any = 0;
  public productId = Number("");
  public search: any = [];
  public quantity: number = 1;
  public Product: any;
  public LastDate = <any>([]);

  Info = {
    product: "",
    id: ""
  }
  // ========================================================================constructor==================================================
  constructor(public api: ApiService, private router: Router) {
    api.products.subscribe(data => {//=============================observable to api.cart
      this.products = data;
    })
    let Session = sessionStorage.getItem('mail')//=================Check if session email connected
    if (Session == null) {
      this.router.navigate([""])
    }
    this.UserName = JSON.parse(localStorage.UserName)
    this.uid = JSON.parse(localStorage.UserId)

    this.fillcart()//================================================fill cart for user
  }
  // =========================================================================================ngOnInit==================================================
  async ngOnInit() {
    this.products = await this.api.getInfoFromServer("getProducts");//=======================bring products for Cards
    console.log(this.products)
    let NewOid = await this.api.NewOid(this.uid)//===========================================update order id
    localStorage.OrderId = JSON.stringify(NewOid[0].order_id)
    this.api.orderId = NewOid[0].order_id;
    this.api.sum = NewOid[0].total_price;//==================================================update total price
    console.log("home user NewOid = ", NewOid)
    this.cart = await this.api.fillcart(this.api.orderId);
  }
  async fillcart() {
    this.cart = await this.api.fillcart(this.api.orderId);
  }
  toggleSidebar() {
    document.getElementById("sidebar").classList.toggle('active');//=========================toggle cart side bar
    document.getElementById("sidebar1").classList.toggle('active1');
  }
  categoryName = i => {
    this.cat = [];//=========================================================================sort category products
    this.flag = 1;
    for (let item of this.products) {
      if (item.catagory_id == i) {
        this.cat.push(item);
      }
    }
    console.log("categoryImported : ", this.cat);
  };

  async console(event) {//======================================================================search product
    console.log("event = ", event)
    this.search = await this.api.searchProduct(this.Info)
  }
  storeproduct() {
    localStorage.CardProduct = JSON.stringify(this.search[0])//==========save product to localstorage for use
  }
  async addToCart() {
    this.Product = JSON.parse(localStorage.CardProduct)//================bring product from localstorage
    localStorage.quantity = JSON.stringify(this.quantity)//==============save quantity to localstorage
    let X = await this.api.addtoBasket(this.Product, this.quantity);//===add to api user basket
  }
}
