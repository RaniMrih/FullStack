import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-login-project',
  templateUrl: './login-project.component.html',
  styleUrls: ['./login-project.component.css']
})

export class LoginProjectComponent implements OnInit {
  public info = <any>({});
  
  flag : any ="Login_page"

  public Access_Req_Info ={
    username: "",
    email:"",
    desc:"",
  }

  public Info = {
    username: "",
    password: "",
  }
  // ========================================================== construcror =======================================================
  constructor(public api: ApiService, private router: Router) {
    localStorage.clear() // clean local storage and set user
    this.bring_servers()
    let tmp =this.api.write_to_log("Website Login page started")// write string to log
  }
  // ========================================================== ngOnInit ==========================================================
  async ngOnInit() {
    // console.log("Screen width is " + screen.width);
    let size = screen.width
    this.bring_servers()
    this.api.start()
    // console.log("bring_servers ");

    if (Number(size) < 1500){
      document.getElementById("page_header1").classList.add("small_zoom");//fix zoom if screen is laptop
      }
  }
    //========================================================= bring all data ====================================================================================
      async bring_servers(){
        this.api.servers_list_from_db=[]
        this.api.servers_list_from_db = await this.api.get_servers_list_from_db("get_servers_from_db");//============bring servers from xl db
        let dead_servers = await this.api.Get_dead_servers()
        await this.api.Filter_Dead_Servers(dead_servers)
        let dead_servers_one_by_one = await this.api.Get_dead_servers_one_by_one()
        await this.api.Add_dead_servers_reason(dead_servers_one_by_one)
        let Mtusbs = await this.api.Bring_Mtusb_List()
        await this.api.Filter_Mtusbs(Mtusbs)
        await this.remove_duplication()//=== for search info
        await this.filter_mst_devices()//=== filter mst_devices_only

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
  mark_allocated_servers(){
    for(let item of this.api.user_allocated_servers_2){
      for(let item1 of this.api.servers_list_from_db){ //add yes to the server
         if(String(item.trim())===String(item1.server_name)){
            item1.allocated = "yes"
         }
      }
    }
    }
  // ================================================== go back function ====================================================================
  go_back(){
    this.flag='Login_page' // change flag 
  }
  // ================================================== open request function ===============================================================
  async Open_Req(){
       this.flag='Open_request' // change flag
       let tmp= await this.api.write_to_log( "open admin request link clicked")// write string to log

  }
  // ================================================== Send email req for Admin access ============================================================
  Send_Email_Admin_Req(){
    // this.api.write_to_log( "sending admin request mail")

    let txt;
    if (this.Access_Req_Info.username == "" || this.Access_Req_Info.email == "" || this.Access_Req_Info.desc == ""){
     txt = '<h3 style="color: #CD5C5C;">Please fill all inputs</h3>'
      document.getElementById("login_header").innerHTML = txt
    }
    else{
        let check_email=this.Access_Req_Info.email.split('@') //check that user inserted @nvidia.com email
        if (check_email[1] !== "nvidia.com"){
          txt='<h3 style="color: #CD5C5C;">Please fill nvidia email</h3>'
          document.getElementById("login_header").innerHTML = txt
        }
        else{
          this.flag='Success'
          this.api.Send_Email_Admin_Req(this.Access_Req_Info);//============send email from nodejs
        }
      }
    }
  // ================================================== filter only allocated servers by user ============================================================
  filter_alloc_servers(arr){
    this.api.user_allocated_servers_2=[]
    for (let line of arr.split(/[\n]+/)){   //============== split lines
      if(line.includes(this.info.user_name)){ //====== search if user name in 
        let line1 = line.split(/[ ,]+/).join(',') //========= remove spaces and replace with (,)
        line1 = line1.split(',')
        this.api.user_allocated_servers_2.push(line1[line1.length -1]) //======== push only the server name from squeue command
       }  
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
      if (item.user == this.Info.username && item.status=="open"){
        this.api.open_tickets_arr.push(item) //============ push only logedin user open tickets
      }
    }
  }
    //===============================================================================    please_wait_alert ===================================================================================================
    async please_wait_alert(){
      let please_wait  ='<div id="login_header1" style="text-align:center;"><div class="mt-1 spinner-grow text-light" role="status"></div></div>'
      document.getElementById("login_header1").innerHTML = please_wait; 
      let tmp = await this.api.write_to_log("alerting please wait...")
    }
  // ================================================== After press submit CheckLogin ============================================================
  async CheckLogin() {
    this.please_wait_alert() //====alert wait

    this.api.servers_list_from_db = await this.api.get_servers_list_from_db("get_servers_from_db");//============bring servers from xl db
    let tmp = await this.api.get_open_tickets("get_open_tickets");//=============================================bring user open tickets
    this.find_open_tickets(tmp)

    // console.log("CheckLogin Username = ", this.Info.username)

    //=== for testing perpuse on windows
    if(this.Info.username == "admin" && this.Info.password == "admin"){
      this.info.results="Admin User"
      this.info.id=1
      this.info.user_name="admin"
      this.info.mail="admin@gmail.com"
      this.info.password="admin"
         }
    if(this.Info.username == "user1" && this.Info.password == "user1"){
      this.info.results="Not Admin"
      this.info.id=2
      this.info.user_name="user1"
      this.info.mail="Avi@gmail.com"
      this.info.password="user1"
    }
    
   //=== for prod work on linux server
    if (this.Info.username !== "admin" && this.Info.username !== "user1" ){
    let check = await this.api.CheckLogin(this.Info); //======== check if user exist Admin / not Admin
    // console.log("CheckLogin check = ", check)

    //=== if authentication passed
    if(check !== "authentication_failed"){
        let check_if_admin = await this.api.check_If_Admin(this.Info)
        // console.log("CheckLogin check_if_admin = ", check_if_admin)

        if (check_if_admin === "Not Admin"){
          this.info.results="Not Admin"
          this.info.id=2
          this.info.user_name=this.Info.username
          this.info.mail=this.Info.username+"@nvidia.com"
          this.info.password=this.Info.password
        }
        if (check_if_admin === "Admin User"){
          this.info.results="Admin User"
          this.info.id=1
          this.info.user_name=this.Info.username
          this.info.mail=this.Info.username+"@nvidia.com"
          this.info.password=this.Info.password
        }
      }

    //=== if authentication failed
      if (check === "authentication_failed" ){
        let txt = '<h3 style="color: #CD5C5C; text-align:center; ">Authentication failed</h3>'
        document.getElementById("login_header1").innerHTML = txt
        let tmp= await this.api.write_to_log(this.info.user_name+ " authentication_failed")

      }
     }

    let arr = await this.api.Bring_All_Allocated_servers(this.info)
    this.filter_alloc_servers(arr)
    this.mark_allocated_servers()

    if (this.info.results === "Admin User") {
      localStorage.UserId = JSON.stringify(this.info.id)
      localStorage.UserName = JSON.stringify(this.info.user_name)
      let tmp= await this.api.write_to_log(this.info.user_name+ " logged in as admin user")// write string to log
      this.router.navigate(['HomeadminComponent'])
    }
    if (this.info.results === "Not Admin") {
      localStorage.UserId = JSON.stringify(this.info.id) //============== localstorage User Id
      localStorage.UserName = JSON.stringify(this.info.user_name)
      localStorage.Password = JSON.stringify(this.info.password)
   
      let tmp= await  this.api.write_to_log(this.info.user_name+ " logged in as regular user") // write string to log
      this.router.navigate(['UsernotadminComponent'])
    }
  }
}
