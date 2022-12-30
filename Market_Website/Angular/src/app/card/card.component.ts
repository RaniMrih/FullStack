import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']

})
export class CardComponent implements OnInit {
  @Input() product; //====== input product [] from <app-homeuser>
  public quantity: number = 1;
  public Product: any;

  constructor(public api: ApiService) {


  }

  ngOnInit() {
    console.log(this.product)
  }

  storeproduct() {
    localStorage.CardProduct = JSON.stringify(this.product)//===save product to localstorage
  }

  async addToCart() {
    this.Product = JSON.parse(localStorage.CardProduct)//=====bring product from localstorage
    localStorage.quantity = JSON.stringify(this.quantity)//===save quantity to localstorage
    let X = await this.api.addtoBasket(this.Product, this.quantity);
  }
}
