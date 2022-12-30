import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-homeadmin',
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit {

  // products = new BehaviorSubject<any>([]);
  products1: any = []
  // productsname: any;
  products: any = [];
  cat: any = [];
  flag: any = 0;
  UserName: any;
  public search: any = [];

  Info = {
    product: "",
    id: ""
  }
  public NewProduct = {
    name: "",
    categoryId: "",
    image: "",
    price: "",
    Description: "",
    imgChanged: 1,
  }

  constructor(public api: ApiService, private router: Router) {
    api.products.subscribe(data => {//=============================observable to api.cart
      this.products = data;
    })
    let Session = sessionStorage.getItem('mail')//=================Check if session email connected
    if (Session == null) {
      this.router.navigate([""])
    }

    this.UserName = JSON.parse(localStorage.UserName)
    this.cat = this.products

  }

  async ngOnInit() {
    this.cat = this.products
  }
  categoryName = i => {
    this.cat = [];
    this.flag = 1;
    for (let item of this.products) {
      if (item.catagory_id == i) {
        this.cat.push(item);
      }
    }
    console.log("categoryImported : ", this.cat);
  };
  async console(event) {
    this.search = await this.api.searchProduct(this.Info)
  }
  toggleSidebar() {
    document.getElementById("sidebar").classList.toggle('active');
    document.getElementById("sidebar1").classList.toggle('active1');
  }
  AddNewProduct() {
    console.log("NewProduct = ", this.NewProduct)
    if (this.NewProduct.name == "" || this.NewProduct.categoryId == "" || this.NewProduct.price == "" || this.NewProduct.image == "") {
      alert("Please fill product fields")
    }
    else {
      document.getElementById("sidebar").classList.toggle('active');
      document.getElementById("sidebar1").classList.toggle('active1');
      alert("New product added")
      this.api.AddNewProduct(this.NewProduct)

    }

  }
}



