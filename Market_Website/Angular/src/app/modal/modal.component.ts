import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() product;//==========get product from <app-card-admin> ========================

  public Changes = {
    productName: "",
    productPrice: "",
    Description: "",
  }

  public productId = Number("");

  constructor(public api: ApiService) { }

  ngOnInit() {
  }
  //==================================Alert no changes when press cancel=========================
  NoChanges() {
    alert("No saved changes")
  }
  //==================================Admin delete Product ====================================
  async deleteProd() {
    let productid = JSON.parse(localStorage.productId)
    this.api.deleteProduct(productid);
    alert("Product deleted from DB")
  }
  //==================================Admin Update Info product ====================================
  async UpdateInfo(id) {
    // localStorage.productId = JSON.parse(this.productId)
    this.productId = JSON.parse(localStorage.productId)
    console.log("this.productId= ", this.productId)
    const info = await this.api.UpdateInfo(this.Changes, this.productId);
    location.reload()
  }
  //==================================Save product ID to localstorage ====================================
  console(id) {
    this.productId = id.product.id;
    console.log("id.product.id = ", id.product.id)
    console.log("id.productId= ", id.productId)
    localStorage.productId = JSON.stringify(this.productId)
    console.log("this.Changes= ", this.Changes)
  }

}
