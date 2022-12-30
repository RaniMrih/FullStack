import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"
// import { ConditionalExpr } from '@angular/compiler';
// import { Console } from 'console';

@Component({
  selector: 'app-dead-servers',
  templateUrl: './dead-servers.component.html',
  styleUrls: ['./dead-servers.component.css']
})
export class DeadServersComponent implements OnInit {
  UserName: any;

public Recovery_Info = {
  server_name: "",
  cards: "",
  device_name:"",
  pci:"",
  has_lf:""
}

public Servers_Info = {
  server_name: "",
  cards: "",
}
public Servers_Info1 = {
  server_name: "",
  cards: "",
}

public info={
  user_name:""
}
//========================================================= constructor ====================================================================================
constructor(public api: ApiService, private router: Router) {
  let user_check = JSON.parse(localStorage.UserName)
  let user_Id = JSON.parse(localStorage.UserId)
  if(user_check == "" || String(user_check) === "undefined" || user_Id=="" || user_Id === "undefined"){ 
    this.api.write_to_log("Security issue: user is trying to load Dead servers component without login!") // write string to log Security issue
    this.router.navigate['']
  }
  else{
  this.bring_servers()
  this.api.UserName , this.UserName = JSON.parse(localStorage.UserName)
  }
  }
  
  //========================================================= bring all data ====================================================================================
 async bring_servers(){
  this.info.user_name=this.UserName
  let tmp = await this.api.write_to_log("Dead servers component loaded")// write string to log
  let dead_servers = await this.api.Get_dead_servers()
  // console.log(dead_servers)
  await this.api.Filter_Dead_Servers(dead_servers)
  tmp = await this.api.write_to_log("Retrived dead servers list")// write string to log

 }
//========================================================= ngOnInit ====================================================================================
async ngOnInit() {
      // console.log("Screen width is " + screen.width);
      let size = screen.width
      if (Number(size) < 1500){
        document.getElementById("page_header1").classList.remove("zoom"); //fix zoom if screen is laptop
        document.getElementById("page_header1").classList.add("small_zoom");
        } 
}
//========================================================= Auto refresh  ====================================================================================
Timer_Refresh() {
window.location.reload()
}
//============================================== open link =======================================================================================
async goToLink(url: string) {
  window.open(url, "_blank");
  let tmp = await this.api.write_to_log("link button clicked for "+url)
}
//========================================================= logout ====================================================================================
async log_out(){
  let tmp = await this.api.write_to_log(this.UserName + " has logged out")// write string to log
}
//========================================================= change componnent ====================================================================================

Change_Component(){
  let UserID = JSON.parse(localStorage.UserId) //===User ID 1 is admin 2 is not
  // console.log(UserID)
  if (UserID == "1"){
  this.router.navigate(['HomeadminComponent'])
  }
  if (UserID == "2"){
    this.router.navigate(['UsernotadminComponent'])
    } 
}
//========================================================= Refresh ====================================================================================
Refresh(){
  this.bring_servers() 
}
//============================================== open ILO =================================================================================
async Open_ILO(server){
window.open("https://"+server+"-ilo", "_blank");
let tmp = await this.api.write_to_log("ILO button clicked for "+server)
}
//===============================================================================    please_wait_alert ===================================================================================================
async please_wait_alert(){
  let please_wait  ='<div class="fixed-top alert alert-info fade-in alerts" role="alert"><h2>Please wait ...<h2><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="spinner-border text-info" role="status"></div>'
  document.getElementById("page_alert").innerHTML = please_wait; 
  let tmp = await this.api.write_to_log("alerting please wait...")
}
  //===============================================================================    please_wait_alert_few_seconds ===================================================================================================
  async please_wait_few_sec_alert(){
    let please_wait  ='<div class="fixed-top alert alert-info fade-in alerts" role="alert"><h2>Please wait few seconds for MiniMARS session ...<h2><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="spinner-border text-info" role="status"></div>'
    document.getElementById("page_alert").innerHTML = please_wait; 
    let tmp = await this.api.write_to_log("alerting please wait few seconds to get MiniMars session id")
  }
  //===============================================================================  sucess_alert ===================================================================================================
  async sucess_alert(txt){  
    let sucess= '<div class="fixed-top alert alert-success alert-dismissible fade show alerts" role="alert"><h3>'+txt+'<h3><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
    document.getElementById("page_alert").innerHTML = sucess;
    let tmp = await this.api.write_to_log("alerting success message : "+txt)
  }
    //===============================================================================  MiniMARS sucess_alert ===================================================================================================
    async MiniMARS_sucess_alert(link,obj){  
      let sucess= '<div class="fixed-top alert alert-success alert-dismissible fade show alerts" role="alert"><h3>Started MiniMARS session on '+obj.server_name+'<a href="'+link+'" target="_blank" class="alert-link"> Link </a><h3><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
      document.getElementById("page_alert").innerHTML = sucess;
      let tmp = await this.api.write_to_log("alerting MiniMARS success message : "+link)
    }
      //===============================================================================  error_alert ===================================================================================================
      async error_alert(){  
        let error= '<div class="fixed-top alert alert-danger alert-dismissible fade show alerts" role="alert"><h3>Error starting MiniMaRS session, please try again<h3><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        document.getElementById("page_alert").innerHTML = error;
        let tmp = await this.api.write_to_log("alerting MiniMARS Error starting MiniMaRS session")
      }
    
}

