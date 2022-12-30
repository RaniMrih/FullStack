import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-modalproduct',
  templateUrl: './modalproduct.component.html',
  styleUrls: ['./modalproduct.component.css']
})
export class ModalproductComponent implements OnInit {

  quantity: number = 1;
  public productId = Number("");

  @Input() product;

  constructor(public api: ApiService) { }

  ngOnInit() {
    console.log(this.product)
  }
  addToCart(event) {
    console.log("this.product", event)
    // this.api.addtoBasket(this);
    // console.log("this.product", event)
  }

  console(id) {
    this.productId = id.product.id;
    console.log("id.product.id = ", id.product.id)
    // localStorage.ImageId = JSON.stringify(this.productId)
    // console.log("this.Changes= ", this.Changes)


  }

}
