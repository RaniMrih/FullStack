import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-card-admin',
  templateUrl: './card-admin.component.html',
  styleUrls: ['./card-admin.component.css']
})
export class CardAdminComponent implements OnInit {

  public Changes = {  //===object to send to server
    newURL: "",
  }

  public ImageId = Number(""); //===image id send to server
  @Input() product; //====== input product [] from <app-homeadmin>

  constructor(public api: ApiService) {

  }

  ngOnInit() {

  }
  //==================================Alert no changes when press cancel on modal image=========================
  NoChanges() {
    alert("No saved changes")
  }
  //==================================update image URL from modal =========================
  async UpdateImage() {
    this.ImageId = JSON.parse(localStorage.ImageId) //===save product id to localstorage
    console.log("this.ImageId= ", this.ImageId, "Changes= ", this.Changes)
    const info = await this.api.UpdateImage(this.Changes, this.ImageId);
  }

}