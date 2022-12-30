import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"
import { observable } from 'rxjs';

@Component({
  selector: 'app-homeadmin',
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit {

//=====variables and objects in use
  counter :any = 0

  cat: any = [];

  // flag: any = "";

  UserName: any;

  public search: any = [];

  public Recovery_Info = {
    server_name: "",
    cards: "",
    device_name:"",
    pci:"",
    has_lf:""
  }

  public Servers_search_obj = {
    server_name: "",
  }

  public Servers_Info = {
    server_name: "",
    cards: "",
  }
  public Servers_Info1 = {
    server_name: "",
    cards: "",
  }

  public FixTicket_obj = {
    Subject:"",
    AssignTo: "",
    Description: "",
    username:"",
  }

  public RedmineTicket_obj = {
    AssignTo: "",
    Description: "",
    username:"",
  }

  public New_NOGA_Server_obj = {
    server_name: "",
    group: "",
    sub_group:""
  }

  public New_SLURM_Server_obj = {
    server_name: "",
    cards:""
  }

  public New_MARS_Server_obj = {
    server_name: "",
    cards:""
  }

  public search_Servers_Info = {
    server_name: "",
    cards: "",
    allocated:"",
    has_lf:""
  }

  public Add_new_admin_user_obj= {
    user_to_add : ""
  }

  public Delete_admin_user_obj= {
    user_to_delete : ""
  }

  public info={
    user_name:""
  }
//========================================================= constructor ====================================================================================
  constructor(public api: ApiService, private router: Router) {
    let user_check = JSON.parse(localStorage.UserName)
    let user_Id = JSON.parse(localStorage.UserId)
    if(user_check == "" || String(user_check) === "undefined" || user_Id=="" || user_Id === "undefined"){ 
      this.api.write_to_log("Security issue: user is trying to load homeadmin component without login!") // write string to log Security issue
      this.router.navigate['']
    }
    else{
    this.loading_alert()
    let first_flag= localStorage.flag
    if(first_flag == "" || String(first_flag) === "undefined" ){  
      this.api.flag=0
      localStorage.flag = JSON.stringify(this.api.flag)//===save flag to localstorage if non
      this.api.write_to_log("page flag set to 0 to display first view") // write string to log
      this.Refresh()
      }
    else{
      this.bring_servers()
      }
    this.api.UserName , this.UserName = JSON.parse(localStorage.UserName)
    }  
  }
    //========================================================= bring all data ====================================================================================
   async bring_servers(){
    this.loading_alert()
    this.api.servers_list_from_db=[]
    this.api.servers_list_from_db = await this.api.get_servers_list_from_db("get_servers_from_db");//============bring servers from xl db
    this.info.user_name=this.UserName
    let dead_servers = await this.api.Get_dead_servers()
    await this.api.Filter_Dead_Servers(dead_servers)
    let dead_servers_one_by_one = await this.api.Get_dead_servers_one_by_one()
    await this.api.Add_dead_servers_reason(dead_servers_one_by_one)
    let tmp = await this.api.write_to_log("retrived all servers from db")// write string to log
    let arr = await this.api.Bring_All_Allocated_servers(this.info) //==== perform squeue command to bring allocated servers
    tmp = await this.api.write_to_log("performed squeue command to check user allocated servers")
    this.filter_alloc_servers(arr)
    this.mark_allocated_servers()//=== add yes to allocated server
    await this.remove_duplication()//=== for search info
    await this.filter_mst_devices()//=== filter mst_devices_only
    this.return_to_same_view()//=== according to flag display page
    let tickets = await this.api.get_open_tickets("get_open_tickets");//=======bring user open tickets
    tmp = await this.api.write_to_log("retrived user open tickets")
    this.find_open_tickets(tickets)//==========================================push all / user open tickets
    let OSs = await this.api.Bring_OS_List()
    await this.Filter_OSs(OSs)
    let Mtusbs = await this.api.Bring_Mtusb_List()
    await this.api.Filter_Mtusbs(Mtusbs)
    this.Cancel_alert()
     }
  //========================================================= ngOnInit ====================================================================================
  async ngOnInit() {
        this.loading_alert()
        let size = screen.width
        if (Number(size) < 1500){
          document.getElementById("page_header1").classList.remove("zoom"); //fix zoom if screen is laptop
          document.getElementById("page_header1").classList.add("small_zoom");        
          } 
  let tmp = await this.api.write_to_log("homeadmin component loaded")// write string to log
  setInterval(this.Timer_Refresh, 300000); // set delay to page refresh, 1 sec = 1000
  }
  //========================================================= Auto refresh  ====================================================================================
  Timer_Refresh() {
    let tmp = this.api.write_to_log("homeadmin component page auto refreshed")
  // window.location.reload()
   this.bring_servers()
}
  //========================================================= Refresh ====================================================================================
  Refresh(){
    this.bring_servers() 
  }  
  //========================================================= logout ====================================================================================
  async log_out(){
    let tmp = await this.api.write_to_log(this.UserName + " has logged out")// write string to log
  }
  //========================================================= remove_duplication for search array ====================================================================================
   remove_duplication(){
    for(let item of this.api.servers_list_from_db){ //=== run on all servers
      let found =0
      for(let item1 of this.api.search_arr_filtered){
        if (String(item.server_name)==String(item1)){
          found=1
        }
      }
      if(found==0){
        this.api.search_arr_filtered.push(item.server_name) //=== search_arr_filtered containes servers without duplication
      }
    }
   }
     //========================================================= filter_mst_devices ====================================================================================
     filter_mst_devices(){
      for(let item of this.api.servers_list_from_db){ //=== run on all servers
        let found =0
        for(let item1 of this.api.mst_devices_arr_filtered){
          if (String(item.device_name)==String(item1)){
            found=1
          }
        }
        if(found==0){
          this.api.mst_devices_arr_filtered.push(item.device_name) //=== containes mst devices without duplication
        }
      }
     }
// ========================================================== add yes to allocated servers ==========================================================
    async mark_allocated_servers(){
      for(let item of this.api.user_allocated_servers_2){
        for(let item1 of this.api.servers_list_from_db){ //=== add yes to allocated server
           if(String(item.trim())===String(item1.server_name)){
              item1.allocated = "yes"
            }
           }
          }
          let tmp = await this.api.write_to_log("marked allocated servers for user")// write string to log
      }
// ================================================== filter only allocated servers by user ============================================================
  filter_alloc_servers(arr){
    this.api.user_allocated_servers_2=[]
    for (let line of arr.split(/[\n]+/)){   //============== split lines from squeue command data
      if(line.includes(this.UserName)){ //====== search if user name in 
        let line1 = line.split(/[ ,]+/).join(',') //========= remove spaces and replace with (,)
        line1 = line1.split(',')
        this.api.user_allocated_servers_2.push(line1[line1.length -1]) //======== push only the server name from squeue
       }  
  }
}
// ================================================== filter OSs and push to api list ============================================================
Filter_OSs(OSs){
  this.api.OS_List=[]
  for (let line of OSs.split(/[\n]+/)){   //============== split lines 
      this.api.OS_List.push(line) //======== push OSs to api array
     }  
    // console.log( this.api.OS_List)
}

// ================================================== show only running servers ============================================================
Show_running_servers(){

 this.api.Running_Servers_Arr = []
 for (let item of this.api.servers_list_from_db){ // this for loop for poshing only running servers
  if (item.status !== "idle"){
    this.api.Running_Servers_Arr.push(item)
  }
 }

 this.api.non_alocated_running_servers_empty=1 //=== 1 for non allocated and no running servers at all
 for(let item of this.api.servers_list_from_db){
   if (item.allocated == "no" && item.status !== "idle"){ //============ if there is no allocated servers for user
     this.api.non_alocated_running_servers_empty=0 //=== 0 if there is any server running on website and not allocated
   }
 }

 this.api.flag=3
 document.getElementById("page_header").innerHTML="All running servers"; //===display the header of the catagory
 localStorage.flag = JSON.stringify(this.api.flag)//===save flag to localstorage
}
// ================================================== show only dead servers component ============================================================
Show_dead_servers(){
  // this.router.navigate(['DeadserversComponent'])//===change component to dead servers
  // if (String(navigator.platform) == "win32" || String(navigator.platform) == "Win32" ){
  //   window.open("http://localhost:4200/DeadserversComponent", "_blank");
  // }
  // else{
     window.open("http://systemservice/DeadserversComponent", "_blank");

  // }
   this.api.write_to_log("Dead servers cmponent loaded")
}
// ================================================== show only mtusbs list component ============================================================

Show_Mtusbs_list(){
  // this.router.navigate(['MtusbslistComponent'])//===change component to dead servers
  // if (String(navigator.platform) == "win32" || String(navigator.platform) == "Win32" ){
  //   window.open("http://localhost:4200/MtusbslistComponent", "_blank");
  // }
  // else{
     window.open("http://systemservice/MtusbslistComponent", "_blank");

  // }
   this.api.write_to_log("Dead servers cmponent loaded")
}

//========================================================= categoryName2 for catagory buttons ====================================================================================  
   categoryName2 = i => {
    this.cat = [];
    this.api.flag = 1;//====flag 1 to display html catagory content
    localStorage.flag = JSON.stringify(this.api.flag)//===save flag to localstorage
    localStorage.categoryName = JSON.stringify(i)//===save categoryName to localstorage
    let tmp = this.api.write_to_log("button " + i + " clicked")
    tmp = this.api.write_to_log("page flag set to 1 to display sorted servers view")// write string to log

    for (let item of this.api.servers_list_from_db) {
      if (i == "All"){
        this.cat.push(item);  
      }
      if(i == "Regression" && item.server_name.startsWith("l-fwreg")){
      this.cat.push(item); 
      }
      if(i == "Development" && item.server_name.startsWith("l-fwdev")){
      this.cat.push(item); 
      }
      if(i == "Performance" && item.server_name.startsWith("l-fwperf")){
      this.cat.push(item); 
      }
     if(i == "Minireg" && item.server_name.startsWith("l-fwminireg")){
     this.cat.push(item); 
     }
     if(i == "Other" && !item.server_name.startsWith("l-fwminireg")  && !item.server_name.startsWith("l-fwperf")&& !item.server_name.startsWith("l-fwreg") && !item.server_name.startsWith("l-fwdev")){
      this.cat.push(item); 
      }
    }
  document.getElementById("page_header").innerHTML="FW CORE "+i+ " servers"; //===display the header of the catagory

  this.api.empty=1 //=== 1 for non allocated servers
  for(let j of this.cat){
    if (j.allocated == "yes"){ //============ if there is no allocated servers for user
      this.api.empty=0 //=== 0 if user has allocated servers
    }
  }
  if (this.api.empty == 1){
    tmp = this.api.write_to_log("user allocated servers not found")
  }
  else{
    tmp= this.api.write_to_log("user allocated servers found")
  }
  }
//========================================================= press enter on search box ==================================
  onKeypressEvent(event){
    // console.log("event = ", event)
    if (event.key == "Enter"){
      this.server_search()
    }
  }
  //========================================================= search box function ======================================
  server_search(){
    this.api.search_arr=[]
    if (String(this.Servers_search_obj.server_name) == ""){ //if search input is empty show all servers
      this.categoryName2("All")
    }
    else{
    let tmp = this.api.write_to_log("searching for server "+this.Servers_search_obj.server_name+" data")// write string to log

    for (let item of this.api.servers_list_from_db){
      if(String(this.Servers_search_obj.server_name)==String(item.server_name)){
        localStorage.search_server_name = JSON.stringify(item.server_name)//===save search_server_name to localstorage
        this.api.search_arr.push(item)
      }
    }
    // console.log("this.api.search_arr = ", this.api.search_arr)
    this.api.empty=1  //=== 1 for non allocated servers in search
    for(let j of this.api.search_arr){
      if (j.allocated == "yes"){ //============ if there is no allocated servers for user in search
        this.api.empty=0
      }
    }
    this.api.flag = 2;
    localStorage.flag = JSON.stringify(this.api.flag)//===save flag to localstorage  
    tmp = this.api.write_to_log("page flag set to 2 to display searched server view")
  }
}
//============================================== function to store the button pressed server data =============================================
async console(server_name ,card){
  //===== fill the obj to send to back end
  let servers = []
  for (let item of this.api.servers_list_from_db){
    if(server_name === item.server_name && card === item.cards){
      servers.push(item)
    }
  }
  localStorage.server = JSON.stringify(servers)//===save server to localstorage
}
console_test(item){
  // console.log(item)
}
//============================================== function to store the button pressed server data =============================================
async Ticket_console(obj){
  localStorage.ticket = JSON.stringify(obj)//===save server to localstorage
}
//============================================== Show user log in new tab =============================================
async bring_website_user_log(obj){
  let user_logs:any = await this.api.bring_website_user_log(obj,this.UserName)
  var logs = window.open("", String(obj.server_name)); // open new tab
  logs.document.title = String(obj.server_name)
  for (let line of user_logs.split(/[\n]+/)){  //split lines
    logs.document.writeln("<p>"+line+"<p>");
  }
}
//============================================== Show all website log in new window =============================================
async bring_website_log(){
  let tmp= await this.api.write_to_log(this.UserName + " clicked open website logs ")
  let website_logs:any = await this.api.bring_website_log()
  var logs = window.open("", "Recovery website log");
  logs.document.title = "Recovery website log"
  for (let line of website_logs.split(/[\n]+/)){  
    logs.document.writeln("<p>"+line+"<p>");
  }
}
//============================================== function to store the button pressed server data =============================================
async Close_ticket(){
  this.please_wait_alert() //====alert wait
  let data = JSON.parse(localStorage.ticket) //===bring servers data from local storage
  this.api.Close_ticket(data)
  let tickets = await this.api.get_open_tickets("get_open_tickets");//=============================================bring user open tickets
  this.sucess_alert("Ticket closed sucessfully") //====alert success
  let tmp= await this.api.write_to_log("ticket "+data.desc+" closed")
  this.find_open_tickets(tickets)//================================================================================push all / user open tickets
}
//============================================== return_to_same_view after pressing buttons to refresh =============================================
return_to_same_view(){
  let flag = JSON.parse(localStorage.flag) //===bring flag number from localstorage
  if (flag == 0){
    this.api.flag="" //===toggle between flags to refresh the buttons
    this.api.flag=0
    let tmp= this.api.write_to_log("page flag set to 0 to display first view")//write string to log
  }
  if (flag == 1){
    this.api.flag="" //===toggle between flags to refresh the buttons
    let categoryName = JSON.parse(localStorage.categoryName) //===bring categoryName number from localstorage
    this.categoryName2(categoryName)
  }
  if (flag == 2){
    let Server_search = JSON.parse(localStorage.search_server_name) //===bring server name searched from localstorage
    this.Servers_search_obj.server_name=Server_search
    this.server_search()
  }
  if (flag == 3){
    this.Show_running_servers()
  }
}
//============================================== Start_Recovery proccess and send data to backend =============================================
async Start_Recovery_Admin(){
  let time = new Date().toLocaleString()
  this.please_wait_few_sec_alert()//============ alert please wait few sec
  let data = JSON.parse(localStorage.server) //===bring servers data from local storage
  localStorage.server = JSON.stringify([])//===clear server from local storage
  let removed_url = await this.api.remove_old_url(data[0])//============================ remove previous url file
  let response = await this.api.Recover_Server_Admin(data[0]);//============ start the recovery API script 
  let mars_url =await this.api.get_mars_session_url(data[0]);//============ wait for rc=o and url file , get_mars_session_url
  // console.log("mars_url = ", mars_url)
  if (String(mars_url) === ""){  //============= if there is no mars session or Api.py script not started
    this.error_alert()
  }
  

  else{                                            //============== if Api.py script started ok and got mars url link
  let tmp =await this.api.change_server_status_to_in_recovery(data[0]);//============ change from idle to in recovery in xl file db
  this.info.user_name=this.UserName
  let arr = await this.api.Bring_All_Allocated_servers(this.info)
  this.filter_alloc_servers(arr)
  this.mark_allocated_servers()

  tmp =await this.api.write_to_log("recovery button clicked for "+data[0].server_name+" MARS session is starting...")
  tmp =await this.api.write_to_server_log("recovery button clicked for "+data[0].server_name+" MARS session is starting...",this.UserName,data[0])
  tmp =await this.api.write_to_log("Action :" )
  tmp =await this.api.write_to_server_log("Action :" ,this.UserName,data[0])

  // console.log("mars_url = ",mars_url)
  tmp =await this.api.write_to_log("Recovery started on server : " + data[0].server_name)
  tmp =await this.api.write_to_server_log("Recovery started on server : " + data[0].server_name, this.UserName,data[0])
  tmp =await this.api.write_to_log("Recovering card : " + data[0].cards)
  tmp =await this.api.write_to_server_log("Recovering card : " + data[0].cards,this.UserName,data[0])
  tmp =await this.api.write_to_log("Device name : " + data[0].device_name)
  tmp =await this.api.write_to_server_log("Device name : " + data[0].device_name,this.UserName,data[0])
  tmp =await this.api.write_to_log("MiniMARS link: " + mars_url)
  tmp =await this.api.write_to_server_log("MiniMARS link: " + mars_url,this.UserName,data[0])
  this.MiniMARS_sucess_alert(mars_url,data[0])   
  this.bring_servers() //============ bring new data
}
}
//============================================== Start_perpare_minireg proccess and send data to backend =============================================
async Start_perpare_minireg(){
  this.please_wait_alert()
  // let data = JSON.parse(localStorage.server) //===bring servers data from local storage
  // // console.log("Start prepare minireg", data)
  // let tmp =await this.api.change_server_status_to_prepare_minireg(data[0]);//============ change from idle to prepare_minireg
  // this.info.user_name=this.UserName
  // let arr = await this.api.Bring_All_Allocated_servers(this.info)
  // this.filter_alloc_servers(arr)
  // this.mark_allocated_servers()
  // let prepare_minireg =  this.api.prepare_minireg(data[0]);//============ start the recovery

  // tmp =await this.api.write_to_log("prepare mini-reg button clicked for "+data[0].server_name+" MARS session is starting")
  // tmp =await this.api.write_to_log("Action :" )
  // tmp =await this.api.write_to_log("--------" )

  // tmp =await this.api.write_to_log("prepare mini-reg started on server : " + data[0].server_name)
  // tmp =await this.api.write_to_log("prepare mini-reg card : " + data[0].cards)
  // tmp =await this.api.write_to_log("Device name : " + data[0].device_name)
  // tmp =await this.api.write_to_log("MARS session : 0000")

  // tmp =await this.api.write_to_server_log("prepare mini-reg button clicked for "+data[0].server_name+" MARS session is starting",this.UserName,data[0])
  // tmp =await this.api.write_to_server_log("Action :" ,this.UserName,data[0])
  // tmp =await this.api.write_to_server_log("--------" ,this.UserName,data[0])

  // tmp =await this.api.write_to_server_log("prepare mini-reg started on server : " + data[0].server_name, this.UserName,data[0])
  // tmp =await this.api.write_to_server_log("prepare mini-reg card : " + data[0].cards,this.UserName,data[0])
  // tmp =await this.api.write_to_server_log("Device name : " + data[0].device_name,this.UserName,data[0])
  // tmp =await this.api.write_to_server_log("MARS session : 0000",this.UserName,data[0])

  // this.sucess_alert("Prepare mini-reg started, MARS session link 0000")   // alert Sucess and send string
  // this.bring_servers()
}
//============================================== send data to backend to Delete_server=============================================
Delete_server(){
  this.please_wait_alert()
  // let data = JSON.parse(localStorage.server) //===bring servers data from local storage
  // // console.log("Delete server function", data)
  // this.api.Delete_server(data[0]);//============ change from idle to prepare_minireg
  // this.sucess_alert("Server deleted successfully")   // alert Sucess and send string
  // let tmp = this.api.write_to_log("delete server button clicked for "+data[0])
  // this.bring_servers()
}
 //============================================== open ILO =================================================================================
async Open_ILO(server){
  window.open("https://"+server+"-ilo", "_blank");
  let tmp = await this.api.write_to_log("ILO button clicked for "+server)
}
//============================================== open link =======================================================================================
async goToLink(url: string) {
    window.open(url, "_blank");
    let tmp = await this.api.write_to_log("link button clicked for "+url)
 }
 //============================================== add admin user =======================================================================================
 async Add_Admin_User() {
  // console.log("Add_Admin_User works")
  // console.log(this.Add_new_admin_user_obj)
  this.please_wait_alert()
  let response = await this.api.Add_Admin_User(this.Add_new_admin_user_obj);//============ add admin user to api
  if(String(response)=="user_added"){
    this.sucess_alert(this.Add_new_admin_user_obj.user_to_add + " has been added as admin user")//======if user added successfully
    let tmp = await this.api.write_to_log(this.Add_new_admin_user_obj.user_to_add + " has been added as admin user")
  }
  if(String(response)=="user_alrady_admin"){
    this.sucess_alert(this.Add_new_admin_user_obj.user_to_add + " is alrady admin user")//======if user alrady admin
    let tmp = await this.api.write_to_log(this.Add_new_admin_user_obj.user_to_add + " wasn't added as admin user, alrady admin user")

  }
}
 //============================================== delete admin user =======================================================================================
 async delete_Admin_User() {
  let tmp = await this.api.write_to_log("deleting admin user" + this.Delete_admin_user_obj.user_to_delete)
  // console.log("Delete_Admin_User works")
  // console.log(this.Delete_admin_user_obj)
  this.please_wait_alert()
  let response = await this.api.Delete_Admin_User(this.Delete_admin_user_obj);//============ delete admin user from xlsx file
  if(String(response)=="user_deleted"){
    this.sucess_alert(this.Delete_admin_user_obj.user_to_delete + " removed from admin users")//======if user removed successfully 
    let tmp = await this.api.write_to_log("removed admin user" + this.Delete_admin_user_obj.user_to_delete)

  }
  if(String(response)=="error"){
    this.sucess_alert("Error, try to remove user "+this.Delete_admin_user_obj.user_to_delete+ " again")//======if user not removed
    let tmp = await this.api.write_to_log("Error, try to remove user "+this.Delete_admin_user_obj.user_to_delete)
  }
}
  //===============================================================================  Loaing_alert ===================================================================================================
  async Cancel_alert(){
    let Cancel  ='<div></div>'
    document.getElementById("page_alert1").innerHTML = Cancel; 
  }
  //===============================================================================  Loaing_alert ===================================================================================================
async loading_alert(){
  let loading  ='<div style="background-color: rgb(232, 253, 253); position="relative" class="fixed-top alert alert-info fade-in alerts" role="alert"><h5>Retrieving data ... please wait<h5><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div style="position="relative" class="spinner-grow text-info" role="status"></div>'
  document.getElementById("page_alert1").innerHTML = loading; 
}
  //===============================================================================    please_wait_alert ===================================================================================================
  async please_wait_alert(){
    let please_wait  ='<div style="background-color: rgb(232, 253, 253)" class="fixed-top alert alert-info fade-in alerts" role="alert"><h5>Please wait ...<h5><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="spinner-grow text-info" role="status"></div>'
    document.getElementById("page_alert").innerHTML = please_wait; 
    let tmp = await this.api.write_to_log("alerting please wait...")
  }
    //===============================================================================    please_wait_alert_few_seconds ===================================================================================================
    async please_wait_few_sec_alert(){
      let please_wait  ='<div style="background-color: rgb(232, 253, 253)" class="fixed-top alert alert-info fade-in alerts" role="alert"><h5>Please wait few seconds for MiniMARS session ...<h5><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="spinner-grow text-info" role="status"></div>'
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
      
  //==============================================================================  add new server to Noga ===================================================================================================
  Add_New_NOGA_Server(){
    this.api.write_to_log("adding new server to noga")

    if (this.New_NOGA_Server_obj.server_name=="" || this.New_NOGA_Server_obj.group=="" || this.New_NOGA_Server_obj.sub_group==""){
      let txt = '<h6 style="color: red; text-align:center; ">Fill in all inputs</h6>'
      document.getElementById("NOGA_head").innerHTML = txt;
      // this.api.write_to_log("adding new server to noga, need to fill all inputs")

    }
    else{
    this.please_wait_alert()
    let New_NOGA = this.api.Add_New_NOGA_Server(this.New_NOGA_Server_obj);//============ go to api add new server to noga
    this.New_NOGA_Server_obj.server_name="" //============ clean form inputs
    this.New_NOGA_Server_obj.group=""
    this.New_NOGA_Server_obj.sub_group=""
    let txt = '<div></div>'
    document.getElementById("NOGA_head").innerHTML = txt;
    this.sucess_alert("Server has been added sucessfully to NOGA")
    }
  }
  //=============================================================================  add new server to slurm ===================================================================================================
   Add_New_SLURM_Server(){
    let tmp = this.api.write_to_log("adding new server to SLURM")

    if (this.New_SLURM_Server_obj.server_name=="" || this.New_SLURM_Server_obj.cards==""){
      let txt = '<h6 style="color: red; text-align:center; ">Fill in all inputs</h6>'
      document.getElementById("SLURM_head").innerHTML = txt;
      let tmp = this.api.write_to_log("adding new server to SLURM, need to fill all inputs")
    }
    else{
      this.please_wait_alert()
      let New_SLURM = this.api.Add_New_SLURM_Server(this.New_SLURM_Server_obj);//============ go to api add new server to slurm
      this.New_SLURM_Server_obj.server_name="" //============ clean form inputs
      this.New_SLURM_Server_obj.cards=""
      let txt = '<div></div>'
      document.getElementById("SLURM_head").innerHTML = txt;
      this.sucess_alert("Server has been added sucessfully to SLURM")
      let tmp = this.api.write_to_log("Server has been added sucessfully to SLURM "+this.New_SLURM_Server_obj)
    }
  }
//===============================================================================  open new Service tiket ===================================================================================================
  async New_Service_Fix_Ticket(){
    this.api.write_to_log("opening new service fix ticket...")

    if (this.FixTicket_obj.Subject=="" || this.FixTicket_obj.AssignTo=="" || this.FixTicket_obj.Description==""){
      let txt = '<h6 style="color: red; text-align:center; ">Fill in all inputs</h6>'
      document.getElementById("Service_fix_ticket_head").innerHTML = txt;
      let tmp = await this.api.write_to_log("adding new serice fix ticket, need to fill all inputs")
    }
    else{
    this.please_wait_alert()      // alert please wait
      
    this.FixTicket_obj.username=this.UserName  
    let Fix_Ticket = await this.api.New_Service_Fix_Ticket(this.FixTicket_obj);//============ open service fix ticket
    let txt = '<div></div>'//============ clean head
    document.getElementById("Service_fix_ticket_head").innerHTML = txt;  
    this.sucess_alert("Service ticket submitted successfully")   // alert Sucess and send string
    this.api.write_to_log("new Service ticket submitted successfully "+ this.FixTicket_obj.Description)//write string to log
    this.FixTicket_obj.AssignTo="" //============ clean form inputs
    this.FixTicket_obj.Subject=""
    this.FixTicket_obj.Description=""
    this.find_open_tickets(Fix_Ticket)
    }
  }
//===============================================================================  find_open_tickets ===================================================================================================
  find_open_tickets(data){
    this.api.open_tickets_arr=[]
    this.api.All_open_tickets_arr=[]
    for (let item of data){
      if(item.status=="open"){
        this.api.All_open_tickets_arr.push(item) //============ push all users open tickets
      }
      if (item.user == this.UserName && item.status=="open"){
        this.api.open_tickets_arr.push(item) //============ push only logedin user open tickets
      }
    }
  }
  
  //===================================================================================== add to MARS ===================================================================================================
   async Add_New_MARS_Server(){
    let tmp = this.api.write_to_log("adding new server to MARS...")
    // console.log("this.New_MARS_Server_obj",this.New_MARS_Server_obj)

    if (this.New_MARS_Server_obj.server_name=="" || this.New_MARS_Server_obj.cards==""){
      let txt = '<h6 style="color: red; text-align:center; ">Fill in all inputs</h6>'
      document.getElementById("MARS_head").innerHTML = txt;
      let tmp = this.api.write_to_log("adding new server to MARS, need to fill all inputs")
    }
    if (!this.New_MARS_Server_obj.cards.startsWith("/dev/mst/mt")){
      let txt = '<h6 style="color: red; text-align:center; ">Insert in valid device</h6>'
      document.getElementById("MARS_head").innerHTML = txt;
      let tmp = this.api.write_to_log("adding new server to MARS, need Insert in valid device")
    }
    else{
      this.please_wait_alert()
      let New_MARS = await this.api.Add_New_MARS_Server(this.New_MARS_Server_obj);//============ add new server to MARS
      // console.log(New_MARS);//============ add new server to MARS
      let tmp = this.api.write_to_log(String(New_MARS))
      this.sucess_alert("Server "+this.New_MARS_Server_obj.server_name+" conf and topo files have been added sucessfully to MARS")   // alert Sucess and send string
      tmp = this.api.write_to_log("Server confs and topo files have been added sucessfully to MARS, Server: "+ this.New_MARS_Server_obj.server_name+" card: "+this.New_MARS_Server_obj.cards)

      this.New_MARS_Server_obj.server_name="" //============ clean form inputs
      this.New_MARS_Server_obj.cards=""
      let txt = '<div></div>'
      document.getElementById("MARS_head").innerHTML = txt;

    }
  }

}



