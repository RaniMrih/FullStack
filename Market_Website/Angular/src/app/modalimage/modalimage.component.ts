import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modalimage',
  templateUrl: './modalimage.component.html',
  styleUrls: ['./modalimage.component.css']
})
export class ModalimageComponent implements OnInit {

  public productId = Number("");

  public Changes = {
    newURL: "",

  }
  @Input() product;
  constructor(public api: ApiService) { }

  ngOnInit() {
  }

  async UpdateInfo(id) {
    // localStorage.productId = JSON.parse(this.productId)
    this.productId = JSON.parse(localStorage.productId)
    console.log("this.productId= ", this.productId)
    const info = await this.api.UpdateInfo(this.Changes, this.productId);
    location.reload()
  }


  console(id) {
    this.productId = id.product.id;
    console.log("id.product.id = ", id.product.id)
    localStorage.ImageId = JSON.stringify(this.productId)
    console.log("this.Changes= ", this.Changes)


  }

}