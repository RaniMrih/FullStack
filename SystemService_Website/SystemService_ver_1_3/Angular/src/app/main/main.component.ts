import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public http: HttpClient , public api: ApiService, private router: Router) { 
    // this.start()
  }
    // ===================================================================================================================
    // async start() {
    //   let Uid = JSON.parse(localStorage.UserId)   
    //   this.api.get_servers_list_from_db("get_servers_from_db");//============bring servers from xl db
    //   let dead_servers = await this.api.Get_dead_servers()
    //   await this.api.Filter_Dead_Servers(dead_servers)
    //   await this.api.Add_dead_servers_reason()
    //   console.log("this.api.servers_list_from_db from Main = ", this.api.servers_list_from_db)

  
    // }
      

  ngOnInit() {
  }

}
