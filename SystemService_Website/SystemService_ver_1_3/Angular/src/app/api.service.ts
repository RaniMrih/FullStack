import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
// import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public UserID = <any>("");
  public globalURL = 'http://systemservice:5001';    
  // public globalURL = 'http://systemservice:3000';
  // public globalURL = 'http://localhost:5001';
  public sum: number = 0;
  public quantity: number = 1;
  public flag: any = "";
  public flag1: any = 0;
  public servers_list = new BehaviorSubject<any>([]);
  public reg_servers = <any>([])
  public dev_servers = <any>([])
  public perf_servers = <any>([])
  public other_servers = <any>([])
  public all_servers = <any>([])
  public win_servers = <any>([])
  public servers_obj_arr = <any>([]);
  public Running_Servers_Arr =<any>([])
  public user_allocated_servers = <any>([]); //containes all Allocated servers
  public user_allocated_servers_2 = <any>([]); //containes only user allocated servers name
  public servers_livefish= <any>([]); //containes servers that have live fish
  public search_arr= <any>([]); //containes search obj servers
  public search_arr_filtered= <any>([]); //containes search obj servers without duplicate
  public mst_devices_arr_filtered = <any>([]);//containes filtered mst_devices
  public empty : number = 1;
  public non_alocated_running_servers_empty: number =1;
  public OS_type = <any>("");
  public servers_list_from_db= <any>([]);//containes servers from xl file db
  public open_tickets_arr=<any>([]);//user open tickets
  public All_open_tickets_arr=<any>([]);//All users open tickets
  public OS_List=<any>([])
  public Mtusbs_List=<any>([])
  public Dead_Servers_List=<any>([])
  public Interval : any = 2000;
  public time = new Date;
  public UserName: any;
  public DataLoaded= false
  
  // ========================================constructor==============================================================
  constructor(public http: HttpClient) {
    // this.servers_list; <object>([]); this.getInfoFromSLURM("getservers");//=====================bring servers list from slurm  
    // this.get_servers_list_from_db("get_servers_from_db");//============bring servers from xl db
    // let dead_servers = this.Get_dead_servers()
    // this.Filter_Dead_Servers(dead_servers)
    // this.Add_dead_servers_reason()
    this.start()
  }

  // ===================================================================================================================
  async start() {
    let Uid = JSON.parse(localStorage.UserId)   
    await this.get_servers_list_from_db("get_servers_from_db");//============bring servers from xl db
    let dead_servers = await this.Get_dead_servers()
    await this.Filter_Dead_Servers(dead_servers)
    let dead_servers_one_by_one = await this.Get_dead_servers_one_by_one()
    await this.Add_dead_servers_reason(dead_servers_one_by_one)

  }
    // =============================================write to website log ======================================================================
    async write_to_server_log(string,username,server){
      // console.log("write_to_server_log",string,username,server )
      let obj = {
        action:string,
        username:username,
        server_name:server.server_name
      }
      //  console.log("write_to_server_log" , obj)
      // console.log(obj)
      return await this.http.post(this.globalURL + '/write_to_server_log',obj).toPromise().then(result => {
        return result; 
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      }); 
    }
    // =============================================get dead servers =====================================================================
    async Get_dead_servers(){
      let obj = {
        action:"",
      }
      return await this.http.post(this.globalURL + '/Get_dead_servers',obj).toPromise().then(result => {
        return result; 
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      }); 
    }

    
        // =============================================get dead servers =====================================================================
        async Get_dead_servers_one_by_one(){
          let obj = {
            action:"",
          }
          return await this.http.post(this.globalURL + '/Get_dead_servers_one_by_one',obj).toPromise().then(result => {
            return result; 
          }).catch(err => {
            return Promise.reject(err.error || 'Server error');
          }); 
        }
    
    // ================================================== filter Dead_Servers and push to api list ============================================================
async Filter_Dead_Servers(Dead_Servers){
  this.Dead_Servers_List=[]
  for (let line of Dead_Servers.split(/[\n]+/)){   //============== split lines 
    
      let line1 = line.split(/["  ,"]+/).join(',') //========= remove spaces and replace with (,)
      line1 = line1.split(',')
      
      let refreance = line1[0]+" "+line1[1]
      // console.log("refreance = ", refreance)
      // console.log("line1 = ", line1)


      //obj for 2 words obj1 for 3 words obj2 for 4 words
      let obj = {
        reason:line1[0]+" "+line1[1],
        user:line1[2],
        time:line1[3],
        nodes:line1[4]
      }
      let obj1 = {
        reason:line1[0]+" "+line1[1],
        user:line1[2],
        time:line1[3],
        nodes:line1[4]+" , "+line1[5]
      }

      let obj2 = {
        reason:line1[0]+" "+line1[1]+" "+line1[2],
        user:line1[3],
        time:line1[4],
        nodes:line1[5]
      }

      let obj3 = {
        reason:line1[0]+" "+line1[1]+" "+line1[2]+" "+line1[3],
        user:line1[4],
        time:line1[5],
        nodes:line1[6]
      }

      if (refreance.startsWith("REASON") || refreance.trim() === "undefined"){
        continue;
      }
      else if (refreance.startsWith("Not responding") || refreance.startsWith("OS Install")){
        if(line1.length == 5){
          this.Dead_Servers_List.push(obj) //======== push obj to Dead_Serversapi array
        }
        if(line1.length == 6){
          this.Dead_Servers_List.push(obj1) //======== push obj to Dead_Serversapi array
        }
      }
      else if (refreance.startsWith("NHC: Watchdog")){
        this.Dead_Servers_List.push(obj2) //======== push obj1 3 words to Dead_Serversapi array
      }
      else if (refreance.startsWith("NHC: Script")){
        this.Dead_Servers_List.push(obj3) //======== push obj2 4 words to Dead_Serversapi array
      }
      else{
        this.Dead_Servers_List.push(obj) //======== push obj default to Dead_Serversapi array 
      }
     }  
    // console.log( this.Dead_Servers_List)
}

// ================================================== filter Dead_Servers and push to api list ============================================================

 async Add_dead_servers_reason(dead_servers_one_by_one){
  // console.log("Sorted dead servers = ", dead_servers_one_by_one)
  let Dead_Servers_Tmp = []


 for (let line of dead_servers_one_by_one.split(/[\n]+/)){   //============== split lines 
    
  let line1 = line.split(/["  "]+/).join(',') //========= remove spaces and replace with (,)
  line1 = line1.split(',')
  // console.log("Splited line1 = ", line1)
  // line1 = line1.split(',')
      
  let refreance = line1[0]+" "+line1[1]
  // console.log("refreance = ", refreance)


  //obj for 2 words
  let obj = {
    reason:line1[0]+" "+line1[1],
    nodes:line1[2],

  }

  //obj1 for 3 words
  let obj1 = {
    reason:line1[0]+" "+line1[1],
    nodes:line1[2],

  }

  //  obj2 for 4 words
  let obj2 = {
    reason:line1[0]+" "+line1[1]+" "+line1[2],
    nodes:line1[3],

  }

  let obj3 = {
    reason:line1[0]+" "+line1[1]+" "+line1[2]+" "+line1[3],
    nodes:line1[4],
  }

  if (refreance.startsWith("REASON") || refreance.trim() === "undefined"){
    continue;
  }
  else if (refreance.startsWith("Not responding") || refreance.startsWith("OS Install")){
      Dead_Servers_Tmp.push(obj) //======== push obj to Dead_Server tmp array 2 words
  }
  else if (refreance.startsWith("NHC: Watchdog")){
    Dead_Servers_Tmp.push(obj2) //======== push obj1 3 words to Dead_Serversapi array
  }
  else if (refreance.startsWith("NHC: Script")){
    Dead_Servers_Tmp.push(obj3) //======== push obj2 4 words to Dead_Serversapi array
  }
  else{
    Dead_Servers_Tmp.push(obj) //======== push obj default to Dead_Serversapi array 
  }
 }
  //  console.log("Dead_Servers_Tmp = ", Dead_Servers_Tmp)

   for (let item of Dead_Servers_Tmp){
    this.insert_dead_server_to_db(item)
   }

  for(let server of this.servers_list_from_db){ 
   if (!server.dead_reason){
     server.dead_reason="Alive"
   }
 }

 }



// async Add_dead_servers_reason(){

//   console.log("this.Dead_Servers_List =", this.Dead_Servers_List)
//   for(let item of this.Dead_Servers_List){  // for loop on all dead servers
//     //---------------------------covering regular format without split at all : l-fwdev-xxx
//     if (!item.nodes.includes(",") && !item.nodes.includes("[") && !item.nodes.includes("]")){ 
//       // console.log("regular server =" , item.nodes)
//       // console.log("regular server =" , item.reason)      
//       this.insert_dead_server_to_db(String(item.nodes), item)
//      }
  
//     //---------------------------split if there is ","
//     if (item.nodes.includes(",")){
//       let splited_arr = item.nodes.split(",")
//       console.log("item.nodes need to split by ',' = ", splited_arr)
//       for (let i of splited_arr){
//         // console.log(i)

//         //---------------------------covering regular format after split by ",": l-fwdev-xxx
//         if (!i.includes(",") && !i.includes("[") && !i.includes("]")){ //if after first split got server name and no need for another split
//           this.insert_dead_server_to_db(String(i), item)                      
//         }

//         //-------------------covering second format: l-fwdev-xxx , l-fwreg-[xxx-xxx]
//         else if(i.includes("[") && i.includes("]") && !i.includes(",")){ //if after first split got servers range only
//           i = String(i)                                                  
//           i = i.trim()
          
//           let server_type // store server type
//           if(i.startsWith("l-fwreg-")){
//             server_type = "l-fwreg-" 
//             i=i.slice(8);
//           }
//           if(i.startsWith("l-fwdev-")){
//             server_type = "l-fwdev-" 
//             i=i.slice(8);
//           }
//           if(i.startsWith("l-fwperf-")){
//             server_type = "l-fwperf-" 
//             i=i.slice(9);
//           }
//           if(i.startsWith("l-fwvrt-")){
//             server_type = "l-fwvrt-" 
//             i=i.slice(8);
//           }
//           i= i.replaceAll('[','') //remove [ Parenthesis
//           i= i.replaceAll(']','') //remove ] Parenthesis
//           let numbers = i.split("-") //split the numbers
//           let num1 = Number(numbers[0]) //first number 
//           let num2 = Number(numbers[1]) //second number
//           let range = num2 - num1       //subtract and find range between numbers

//           let j = 0 
//           while (range > -1 ){ //insert the first servers and the followers as range > -1
//             let new_number = Number(num1+j)
//             this.insert_dead_server_to_db(String(server_type+new_number),item)
//             range--
//             j++          
//           }  
//         }
//       }
//     }
//     //--------------------covering third format: l-fwreg-[xxx-xxx]
//     else if (item.nodes.includes("[") && item.nodes.includes("]") && !item.nodes.includes(",")){
//       console.log("item.nodes need to split by '[ ]' = ", item.nodes)
//       let server_type // store server type
//       if(item.nodes.startsWith("l-fwreg-")){
//         server_type = "l-fwreg-" 
//         item.nodes=item.nodes.slice(8);
//       }
//       if(item.nodes.startsWith("l-fwdev-")){
//         server_type = "l-fwdev-" 
//         item.nodes=item.nodes.slice(8);
//       }
//       if(item.nodes.startsWith("l-fwperf-")){
//         server_type = "l-fwperf-" 
//         item.nodes=item.nodes.slice(9);
//       }
//       if(item.nodes.startsWith("l-fwvrt-")){
//         server_type = "l-fwvrt-" 
//         item.nodes=item.nodes.slice(8);
//       }
//       item.nodes= item.nodes.replaceAll('[','') //remove [ Parenthesis
//       item.nodes= item.nodes.replaceAll(']','') //remove ] Parenthesis
//       let numbers = item.nodes.split("-") //split the numbers
//       let num1 = Number(numbers[0]) //first number 
//       let num2 = Number(numbers[1]) //second number
//       let range = num2 - num1       //subtract and find range between numbers
//       // console.log("range =",range)

//       let j = 0 
//       while (range > -1 ){ //insert the first servers and the followers as range > -1
//         let new_number = Number(num1+j)
//         this.insert_dead_server_to_db(String(server_type+new_number),item)
//         range--
//         j++          
//       } 
//     }
//   }
//  // after finishing dead servers add Alive to the rest of servers
//   for(let server of this.servers_list_from_db){ 
//     if (!server.dead_reason){
//       server.dead_reason="Alive"
//   }
// }
// }

// ================mini func to insert dead server reason======================================================
insert_dead_server_to_db(item){

  for(let server of this.servers_list_from_db){
    if (String(item.nodes) == String(server.server_name)){
      server.dead_reason=item.reason
    }
  }
}
  // =============================================write to website log ======================================================================
  async write_to_log(string){
    let obj = {
      action:"",
    }
    obj.action = string
    return await this.http.post(this.globalURL + '/write_to_log',obj).toPromise().then(result => {
      return result; 
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 
  }
  // =============================================bring website log file content ======================================================================
  async bring_website_log(){
    return await this.http.get(this.globalURL + '/bring_website_log').toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 

  }
    // =============================================bring website log file content ======================================================================
    async bring_website_user_log(obj,username){
      // console.log(obj)

      let obj1 ={
        username:username,
        server_name:obj.server_name,
        device_name:obj.device_name,
        pci:obj.pci,
        cards:obj.cards
      }

      return await this.http.post(this.globalURL + '/bring_website_user_log',obj1).toPromise().then(result => {
        return result;
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      }); 
  
    }
// =============================================bring the list of available OSs ======================================================================
    async Bring_OS_List(){
      let obj ={
        username:"",
      }
      return await this.http.post(this.globalURL + '/Bring_OS_List',obj).toPromise().then(result => {
        return result;
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      }); 
    }
// ================================================== filter OSs and push to api list ============================================================
async Filter_Mtusbs(Mtusbs){
  this.Mtusbs_List=[]
  // console.log("inside mtusbs" , this.api.servers_list_from_db)
 
  for (let item of Mtusbs){  
    // console.log("item = " , item)

    item.server_name = item['server (I2C side)'] //=================== the obj property has spaces from xl file, replace the spaces with new property
    item.remote_machine_usb_side = item['remote machine (USB side)'] 
    item.device_name = item['Device name']
    
    delete item['server (I2C side)']
    delete item['remote machine (USB side)']//======================== delete old property
    delete item['Device name']

    if(item.device.trim() == "" || item.remote_machine_usb_side.trim() == "" || item.device_name.trim() == "" || item.server_name.trim() === "undefined" || !item.server_name.trim().startsWith("l-fw")){
      continue;
    }
    
    if (item.device.includes(" ")){
      let only_card_name = item.device.split(" ") //==== clean card name like: Negev crypto , Galil MH , BlueField-2 A1
      item.device = only_card_name[0].trim()
     }

    for (let server of this.servers_list_from_db){ //========= add the mtusb information obj to the server that has same name and card
      if (item.server_name.trim() == server.server_name.trim() && item.device.trim() == server.cards.trim()){
        server.mtusb_info = item
        // console.log("item = " , item)
        // console.log("server = " , server)
      }
     }  
  }
    
  for (let server of this.servers_list_from_db){ //========= add none to all servers that dosen't have mtusb connected
    if (!server.mtusb_info){
      server.mtusb_info = "none"
    }
   }
   
  // console.log("servers_list_from_db = " , this.servers_list_from_db)

return
}
//=============================================bring the list of Mtusbs ======================================================================
async Bring_Mtusb_List(){
let obj ={
  username:"",
}
return await this.http.post(this.globalURL + '/Bring_Mtusb_List',obj).toPromise().then(result => {
  return result;
}).catch(err => {
  return Promise.reject(err.error || 'Server error');
});    
}
//========================================================== check user have admin permission==========================================================
check_If_Admin(obj){
    return this.http.post(this.globalURL + '/check_If_Admin',obj).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 
    
}
//========================================================== check user have admin permission==========================================================
 async Add_Admin_User(obj){
    return await this.http.post(this.globalURL + '/Add_Admin_User', obj).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 
  }
  //========================================================== check user have admin permission==========================================================
  Delete_Admin_User(obj){
    return this.http.post(this.globalURL + '/Delete_Admin_User', obj).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 
    
  }

  
  // ========================================================== check if server has lf ==========================================================
  check_if_has_lf(){
    return this.http.get(this.globalURL + '/check_if_has_lf').toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 
    
  }
  
      //=========================================== get servers list from xl db =========================================

      get_servers_list_from_db(url){
        return this.http.get(this.globalURL + '/' + url).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        }); 
      }

     //=========================================== get servers list from xl db =========================================

      get_open_tickets(url){
        return this.http.get(this.globalURL + '/' + url).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        }); 
      }
      
    //=========================================== Open new service ticket =========================================

    New_Service_Fix_Ticket(obj){
      return this.http.post(this.globalURL + '/New_Service_Fix_Ticket', obj).toPromise().then(result => {
        return result;
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      }); 
    }
    
     //=========================================== New_Redmine_Ticket =========================================

       New_Redmine_Ticket(obj){
        return this.http.post(this.globalURL + '/New_Redmine_Ticket', obj).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        }); 
      }
      
    //=========================================== Add_New_NOGA_Server =========================================

  Add_New_NOGA_Server(obj){
    return this.http.post(this.globalURL + '/Add_New_NOGA_Server', obj).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    }); 
  }
   //=========================================== Add_New_MARS_Server =========================================
      Add_New_MARS_Server(obj){
        return this.http.post(this.globalURL + '/Add_New_MARS_Server', obj).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        }); 
      }
   //=========================================== get_mars_session_url =========================================

     get_mars_session_url(obj){
        return this.http.post(this.globalURL + '/get_mars_session_url', obj).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        }); 
      }
    //=========================================== remove_old_mars_url =========================================
      remove_old_url(obj){
        return this.http.post(this.globalURL + '/remove_old_url',obj).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        });  
      }
      //=========================================== Add_New_SLURM_Server =========================================

      Add_New_SLURM_Server(obj){
        return this.http.post(this.globalURL + '/Add_New_SLURM_Server', obj).toPromise().then(result => {
          return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        }); 
      }
  //=========================================== Recover_Server_Admin===============================================================

  Recover_Server_Admin(obj){
    return this.http.post(this.globalURL + '/Recover_Server_Admin', obj).toPromise().then(result => {
      return result; 
      }).catch(err => {
     return Promise.reject(err.error || 'Server error');
       }); 
     }

       //=========================================== Recover_Server_User ===============================================================

  Recover_Server_User(obj){
    return this.http.post(this.globalURL + '/Recover_Server_Admin', obj).toPromise().then(result => {
      }).catch(err => {
     return Promise.reject(err.error || 'Server error');
       }); 
     }
    //=========================================== prepare_minireg ===============================================================

    prepare_minireg(obj){
      return this.http.post(this.globalURL + '/prepare_minireg', obj).toPromise().then(result => {
      return result;
        }).catch(err => {
       return Promise.reject(err.error || 'Server error');
         }); 
       }
    //=========================================== Delete_server ===============================================================

    Delete_server(obj){
      return this.http.post(this.globalURL + '/Delete_server', obj).toPromise().then(result => {
      return result;
        }).catch(err => {
       return Promise.reject(err.error || 'Server error');
         }); 
       }  
      //=========================================== Close_ticket ===============================================================
       Close_ticket(obj){
        return this.http.post(this.globalURL + '/Close_ticket', obj).toPromise().then(result => {
          return result;
            }).catch(err => {
           return Promise.reject(err.error || 'Server error');
             });  
       }  
    //=========================================== change_server_status in db xlsx file to in_recovery=========================================

    change_server_status_to_in_recovery(obj){
      return this.http.post(this.globalURL + '/change_server_status_to_in_recovery', obj).toPromise().then(result => {
      return result;
        }).catch(err => {
       return Promise.reject(err.error || 'Server error');
         }); 
       }
   //=========================================== change_server_status in db xlsx file to prepare minireg =========================================

        change_server_status_to_prepare_minireg(obj){
          return this.http.post(this.globalURL + '/change_server_status_to_prepare_minireg', obj).toPromise().then(result => {
          return result;
            }).catch(err => {
           return Promise.reject(err.error || 'Server error');
             }); 
           }
       
      
    //=========================================== shell_command_test ===========================================================

  shell_command_test(){
      let user = "rmrih"
      this.http.post(this.globalURL + '/shell_command_test', user).toPromise().then(result => {
      let test= result;
    }).catch(err => {
      Promise.reject(err.error || 'Server error');
    }); 
  }
  
  //=========================================== Brings all servers from slurm =========================================
    // getInfoFromSLURM(url) {
    //   return this.http.get(this.globalURL + '/' + url).toPromise().then(result => {
    //     if (url == "getservers") {
    //       this.servers_list.next(result);
    //     //  console.log("this.servers_list from api = ",this.servers_list)
    //     //  this.shell_command_test()
    //     }
    //     return result;
    //   }).catch(err => {
    //     return Promise.reject(err.error || 'Server error');
    //   });
    // }
    //=========================================== Brings allocated server by user name =========================================
    Send_Email_Admin_Req(obj){
      // console.log(obj)
        return this.http.post(this.globalURL + '/Send_Email_Admin_Req', obj).toPromise().then(result => {
          // return result;
        }).catch(err => {
          return Promise.reject(err.error || 'Server error');
        });    
      }
     //=========================================== Brings PCI links from xlsx file =========================================
     getPCILink(url){
      return this.http.get(this.globalURL + '/' +url).toPromise().then(result => {
        return result;
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      });    

    }
  
      
  //=========================================== Brings allocated server by user name =========================================
    Bring_All_Allocated_servers(obj){
      // console.log("obj", obj)

   let Info = {
    username: obj.user_name,
  }


      return this.http.post(this.globalURL + '/Bring_All_Allocated_servers', Info).toPromise().then(result => {
        for (let line of String(result).split(/[\n]+/)){   //============== split slurm file to lines 
          if (line.includes(Info.username)){
            this.user_allocated_servers.push(String(line))
          }
        }
        return result;
      
      }).catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
    }

  //=======================================================check user name and password=========================================
  CheckLogin(Info) {
    return this.http.post(this.globalURL + '/CheckLogin', Info).toPromise().then(result => {
      return (result);
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================Start Session=========================================
  StartSession(UserInfo) {
    return this.http.post(this.globalURL + '/loginSession', UserInfo, { withCredentials: true }).toPromise().then(result => {
      // console.log("result from StartSession=", result)
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }

}

