const port = 5001
const reader = require('xlsx')
var mysql = require('mysql');
var bodyParser = require('body-parser')
const express = require('express');
const session = require('express-session');
const cors = require('cors');
var os = require('os');
var fs = require('fs');
var cp = require('child_process');
//var spwan =require('child_process').spwan;
//var process =
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "market"
});
var app = express();
app.use(session({
    secret: 'somerandonstuffs',
    // proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(cors(corsOptions))
// ============================================================ Get all servers from xl file db =============================================================================================
function write_to_log (string){
  var action = string;
  var time = new Date().toLocaleString().slice(0,-14)
  var message = String(" - "+time + " - "+ action)

   if (os.platform() == "win32"){
     console.log("Writing to windows log  = ",message)
     var file= '//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/website_log.log'
     cp.exec("echo " + message + " >> " + file , function(e, stdout, stderr) { //writing to log file with echo (creats file if not exist)
       })
       }
   else{
      var file= '/tmp/website_log.log'
      if(fs.existsSync(file)){
         console.log("Writing to log  = ",message)
         cp.exec("echo '"+message+"' >> "+file, function(e, stdout, stderr) { //writing to log file with echo (if file exist)
         })}
      else{
         console.log("Writing linux log  = ",message)
         cp.exec("echo '"+message+"' > "+file, function(e, stdout, stderr) { //writing to log file with echo (creats file if not exist)
         })} 
        }
      }
//============================================================ Get all servers from xl file db =============================================================================================
app.get('/get_servers_from_db', function (req, res) {
  write_to_log("get_servers_from_db works")
    if (os.platform() == "win32"){
      var file = reader.readFile('//10.4.0.102/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx') //define file for windows
       }
    else{
      var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx') //define file for linux
       }
       var data = []
       const sheets = file.SheetNames
       for(var i = 0; i < sheets.length; i++)
         {   
         const temp = reader.utils.sheet_to_json(
         file.Sheets[file.SheetNames[i]])
         temp.forEach(function (res) {
         data.push(res) //all xl file data is in data[]
         })  
         }          

        write_to_log(String("data.length = "+ data.length))
        console.log("---------------------------------------")
        res.send(JSON.stringify(data));
        })
//============================================================ Get all servers Mtusb_List from xl file db =============================================================================================
app.post('/Bring_Mtusb_List', function (req, res) {
  write_to_log("Bring_Mtusb_List works")

  var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/hca_mtusb_rshim_mapping.xlsx') //define file for linux
    
  var data = []
  const sheets = file.SheetNames
  for(var i = 0; i < sheets.length; i++)
    {
    const temp = reader.utils.sheet_to_json(
    file.Sheets[file.SheetNames[i]])
    temp.forEach(function (res) {
    data.push(res) // all xl file data is in data[]
    })
    } 
 //   console.log(data)
  write_to_log(String("mtusb data.length = "+ data.length))
  console.log("---------------------------------------")
  res.send(JSON.stringify(data));
  })
// ========================================================== check if windows or linux ==========================================================
app.get('/CheckPlatform', function (req, res) {
  var platform = os.platform()
  console.log("---------------------------------------")
  res.send(JSON.stringify(platform));
  })
// ==============================================New_Service_Fix_Ticket ============================================================================================
app.post('/New_Service_Fix_Ticket', function (req, res) {
  write_to_log("New_Service_Fix_Ticket function works")
  var obj = req.body;
  var AssignTo=obj.AssignTo
  var Description=obj.Description
  var Subject=obj.Subject
  // Reading our test file
  if (os.platform() == "win32"){
    var file = reader.readFile('//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Service_tickets.xlsx')//define file for windows
  }
  else{
    var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/Service_tickets.xlsx')//define file for linux
  }
  try{
  var data = []
  const sheets = file.SheetNames
  for(var i = 0; i < sheets.length; i++)
  {   
  const temp = reader.utils.sheet_to_json(
  file.Sheets[file.SheetNames[i]])
  temp.forEach(function (res) {
  data.push(res)//all xl file data is in data[]
  })  
  } 
  
   if(data.length==0){//create ticket id
    var id=1
   }
   else{
     var id = data[data.length -1].id+1 
   }
 
  // Sample data set
var ticket_data = {
  "id":id,
  "user":obj.username,
  "assign_to":AssignTo,
  "desc":Description,
  "subject":Subject,
  "status":'open'
}

// Modify the xlsx and push the new changes
 data.push(ticket_data)
//  console.log("data =", data)

// update the xlsx file
reader.utils.sheet_add_json(file.Sheets["Sheet1"],data)
if (os.platform() == "win32"){
  reader.writeFile(file,'//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Service_tickets.xlsx')
}
else{
  reader.writeFile(file,'/mswg/projects/fw/fw_ver/hca_system_service_db/Service_tickets.xlsx')
  write_to_log("Opened new service ticket for user "+obj.username+" with subject "+Subject+" assign to: "+AssignTo) //writing to log file 
  cp.exec("python /mswg/projects/fw/fw_ver/hca_system_service_db/scripts/send_mail_new_ticket.py "+"'"+obj.username+"' "+"'"+AssignTo+"' "+"'"+Subject+"' "+"'"+Description+"'", function(e, stdout, stderr) {
  }) 
}
res.send(JSON.stringify(data));
} catch (err) {
  console.error(err)
}

console.log("---------------------------------------")
})
  // ============================================== get_open_tickets ============================================================================================
app.get('/get_open_tickets', function (req, res) {
  write_to_log("get_open_tickets function works")
  if (os.platform() == "win32"){  
    var file = reader.readFile('//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Service_tickets.xlsx')//define file for windows
    }
  else{
    var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/Service_tickets.xlsx')//define file for linux
    }
  try{
    var data = []
    const sheets = file.SheetNames  
    for(var i = 0; i < sheets.length; i++)
    {   
    const temp = reader.utils.sheet_to_json(
    file.Sheets[file.SheetNames[i]])
    temp.forEach(function (res) {
    data.push(res)
    })  
    } 
    res.send(JSON.stringify(data)); //response send back all the tickets in xlsx file
    } catch (err) {
    console.error(err)
    }
console.log("---------------------------------------")
})

  // =========================================================check user have admin permission============================================================================================
app.post('/check_If_Admin', function (req, res) {
  var obj = req.body;
  var username=obj.username
  write_to_log("check_If_Admin user function works")
  if (os.platform() == "win32"){
    var file = reader.readFile('//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Website_admin_users.xlsx')
  }
  else{
    var file = reader.readFile('/.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/Website_admin_users.xlsx')
  }
  try{
    //=======convert xlsx file to JSON
  var data = []
  const sheets = file.SheetNames
  for(var i = 0; i < sheets.length; i++)
  {   
  const temp = reader.utils.sheet_to_json(
  file.Sheets[file.SheetNames[i]])
  temp.forEach(function (res) {
  data.push(res) //contains admin users
  })  
  } 
  }
  catch (err) {
    console.error(err)
    }
    var found=0  
    for(var i = 0; i < data.length; i++)
    {    
    if(username === data[i].user){
      found=1
    }
  }  
 // console.log("found =",found)  
  if (found ===1){
    write_to_log(String("Found "+username+" as Admin user")) 
    res.send(JSON.stringify("Admin User"));
  }
  else{
      write_to_log(String("Found "+username+" as Not Admin user"))
      res.send(JSON.stringify("Not Admin"));
  }
  console.log("---------------------------------------")

})
// ==============================================chcek if user in AD DB perform auth with ldapsearch ============================================================================================
app.post('/CheckLogin', function (req, res) {
  console.log("/CheckLogin function works")

  var obj = req.body;
  var username=obj.username
 
  //authentication using ldap with active directory
  cp.exec("ldapsearch -x -h 10.0.8.1 -b DC=mtl,DC=com -D '"+ username +"@mellanox.com' -w "+ obj.password +" -x sAMAccountName=" +username, function(e, stdout, stderr) {
    var auth_results=stdout
  if (e){
  write_to_log(String("authentication_failed by "+username))
  res.send(JSON.stringify("authentication_failed"));
  }
  else{
  write_to_log(String("authentication ok by "+username+" logging in"))
  res.send(JSON.stringify("authentication_ok"));
  }
  });
  console.log("---------------------------------------")
 
})
// ====================================================== Bring_All_Allocated_servers according to user user ====================================================
app.post('/Bring_All_Allocated_servers', function (req, res) {
  write_to_log("Bring_All_Allocated_servers function works")
  var username = req.body.username;
  //for windows testing only
  if (os.platform() == "win32"){
    var squeue_testing_file = '//10.4.0.102/mswg/projects/fw/fw_ver/hca_system_service_db/squeue.txt'
        try {
         var data = fs.readFileSync(squeue_testing_file, 'utf8')
         res.send(JSON.stringify(data));
         } catch (err) {
         console.error(err)
        }
    }
 else{
     //perform squeue command to bring allocated servers
    try{
    cp.exec("squeue | grep -i "+username+" > /.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/squeue.txt", function(e, stdout, stderr) {
    write_to_log(String("Command: squeue | grep -i "+username+" > /.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/squeue.txt")) 
    })
    var data = fs.readFileSync("/.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/squeue.txt", 'utf8')
  //  console.log(data)
    res.send(JSON.stringify(data));
  }catch (err) {
  console.error(err)
  }
 }
console.log("---------------------------------------")
  });
// ================================================ bring the list of available OSs ====================================================
 app.post('/Bring_OS_List', function (req, res) {
     

   try{
       cp.exec("sudo -u rmrih install_os.sh --list | grep RH_*", function(e, stdout, stderr) { //Bring all OSs command
         write_to_log(String("Retrieved RedHat OSs list"))
         res.send(JSON.stringify(stdout));
         }) 
      }
   catch (err) {
       console.log(err)
       res.send(JSON.stringify(err));
     }   
    //res.send(JSON.stringify(stdout));
    console.log("---------------------------------------")
    })   

// ================================================ bring the list of dead servers  ====================================================
app.post('/Get_dead_servers', function (req, res) {
         try{
          cp.exec("sudo sinfo -R", function(e, stdout, stderr) { //Bring all OSs command
          write_to_log(String("Command: sinfo -R"))
          res.send(JSON.stringify(stdout));
          })  
          }   
         catch (err) {
            console.log(err)
            res.send(JSON.stringify(err));
           }   
console.log("---------------------------------------")
    })  

// ================================================ bring the list of dead servers sorted one by one====================================================
app.post('/Get_dead_servers_one_by_one', function (req, res) {
         try{
          cp.exec("sudo sinfo -R -o '%20E %n'", function(e, stdout, stderr) { //Bring all OSs command
          write_to_log(String("Command: sinfo -R -o '%20E %n'"))
          res.send(JSON.stringify(stdout));
          })  
          }   
        catch (err) {
          console.log(err)
          res.send(JSON.stringify(err));
          }   
         console.log("---------------------------------------")
      })   
// ================================================ write_to_website_log ====================================================
app.post('/write_to_log', function (req, res) {
  var action = req.body.action;
  var time = new Date().toLocaleString().slice(0,-14)
  var message = String(" - "+time + " - "+ action)
  try{
  if (os.platform() == "win32"){
    console.log("Writing to windows log  = ",message)
    var file= '//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/website_log.log'
    cp.exec("echo " + message + " >> " + file , function(e, stdout, stderr) { //writing to log file with echo (creats file if not exist)
      }) 
      } 
  else{
    var file= '/tmp/website_log.log'
     if(fs.existsSync(file)){
       console.log("Writing to log  = ",message)  
       cp.exec("echo '"+message+"' >> "+file, function(e, stdout, stderr) { //writing to log file with echo (if file exist)
       })}
     else{
       console.log("Writing linux log  = ",message)
       cp.exec("echo '"+message+"' > "+file, function(e, stdout, stderr) { //writing to log file with echo (creats file if not exist)
       })}    
       }
       }
  catch (err) {
    console.error(err)
   }
   res.send(JSON.stringify("success"));
   console.log("---------------------------------------")
})
// ================================================ write to server log ====================================================
app.post('/write_to_server_log', function (req, res) {
  var action = req.body.action;
  var username=req.body.username;
  var server=req.body.server_name
  var time = new Date().toLocaleString().slice(0,-14)
  var message = String(" - " + time + " - "+ action)
  try{
  if (os.platform() == "win32"){
    var file= '//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/'+server+'_log.log'
    cp.exec("echo " + message + " >> " + file , function(e, stdout, stderr) { //writing to log file with echo (creats file if not exist with server name)
    })
  }
  else{
    var file= "/tmp/"+server+"_log.log"  
    if(fs.existsSync(file)){
    cp.exec("echo '" + message + "' >> " + file , function(e, stdout, stderr) { //writing to log file with echo (if file exists)
      })}
    else{
    cp.exec("echo '" + message + "' > " + file , function(e, stdout, stderr) { //writing to log file with echo (creats file if not exist with server name)
      })}
      }
   console.log("Writing to server log  = ",message)
      }
  catch (err) {
    console.error(err)
      }
  res.send(JSON.stringify("success"));
  console.log("---------------------------------------")
})
// ================================================ bring_website_log_file ====================================================
 app.get('/bring_website_log', function (req, res) {
  write_to_log("bring_website_log function works")
   try{
     if (os.platform() == "win32"){
       var file= '//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/website_log.log'
       }
      else{
        var file= "/tmp/website_log.log"
          }
          }
    catch (err) {
      console.error(err)
          }
    const data = fs.readFileSync(file, 'utf8') //reads log file
    res.send(JSON.stringify(data));
    console.log("---------------------------------------")
  })
// ================================================ bring_website_user_log_file ====================================================
app.post('/bring_website_user_log', function (req, res) {
  write_to_log("bring_website_user_log function works")
  var server=req.body.server_name;
  try{
   if (os.platform() == "win32"){
    var file= '//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/'+server+'_log.log'
     }
   else{
    var file= "/tmp/"+server+"_log.log"
      }
      }
   catch (err) {
   console.error(err)
   }
   const data = fs.readFileSync(file, 'utf8') //reads log file
   res.send(JSON.stringify(data));
  console.log("---------------------------------------")
 })
// ================================================ remove_old_mars_url ====================================================
 app.post('/remove_old_url', function (req, res) {
 var obj = req.body;     
 var old_url_file = "/tmp/system_services_"+obj.server_name+"_"+obj.cards.toLowerCase()+"_url.txt" 
  if(fs.existsSync(old_url_file)){     
    cp.exec("sudo rm -rf "+old_url_file, function (error,stdout,stderr) {   
    write_to_log(String("Command: sudo rm -rf "+old_url_file+" ;To remove old url file"))
    res.send(JSON.stringify("success"));
    })    
    }
  else{
    write_to_log(String("Command: sudo rm -rf "+old_url_file+" ;No old url file found"))
    res.send(JSON.stringify("file_not_found"));
    }  
 console.log("---------------------------------------")
 })
// ================================================ Recover_Server ====================================================
app.post('/Recover_Server_Admin', function (req, res) {
  var obj = req.body;
    write_to_log(String("Recover_Server inputs Admin = "+ obj))
   try{
if (obj.cards == String("all")){
     console.log("Recover both cards =" ,obj) //need to continue recovery for cards all 
      }
     else{
       cp.exec("python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name , function (error , stdout) {
         if (error){
           write_to_log(String("error = "+ error))
          }
      if (stdout){
         write_to_log(String("stdout = " + stdout))
         write_to_log(String("Finished running python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name+" successfully"))
         }
      })
      }
   }
      catch (err){
        console.error(err)
      }
  res.send(JSON.stringify("success"));  //==== very important line, in order to avoid script loop 
  write_to_log(String("Command: python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name))
})

// ================================================ Recover_Server ====================================================
 app.post('/Recover_Server_User', function (req, res) {
 var obj = req.body;
 console.log("Recover_Server inputs User = ", obj)
 try{
 //    cp.exec("python /.autodirect/swgwork/rmrih/send_mail_new_ticket.py 'test_user' 'Assign_To' 'Fix server ilo' 'server l-fwdev-xxx ilo issue'" , function (error , stdout) { 
   cp.exec("python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name , function (error , stdout) {
   if (error){
      write_to_log(String("error = "+ error))
     }   
   if (stdout){
     write_to_log(String("stdout = " + stdout))
    write_to_log(String("Finished running python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name+" successf    ully")) 
    }   
    })  
   }   
 catch (err){
 console.error(err)
 }   
 res.send(JSON.stringify("success"));  //==== very important line, in order to avoid script loop 
 write_to_log(String("Command: python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name))
 })

// ================================================ Recover_Server ====================================================
//app.post('/Recover_Server_User', function (req, res) {
//  var obj = req.body;
//  console.log("Recover_Server inputs User = ", obj)
//   cp.exec("python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name , function (error , stdout) {
//   try{
//   if (error){
//   console.log("error = ", error)
//     }   
//   if (stdout){
//   console.log("stdout = " , stdout)
//   console.log("Finished running python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode start_recovery --mst_device "+obj.device_name+" --server_name "+obj.server_name+" successfully")
//     }   
//    }   
//  catch (err){
//  console.error(err)
//  }   
//  })  
// res.send(JSON.stringify("success"));  //==== very important line, in order to avoid script loop 
// console.log("------------ running recovery script Api.py ---------------------------")
//})

// ================================================ get_mars_session_url ====================================================
 app.post('/get_mars_session_url', function (req, res) {
   var obj = req.body;
   var url_file = "/tmp/system_services_"+obj.server_name+"_"+obj.cards.toLowerCase()+"_url.txt"
   var rc_file ="/tmp/system_services_"+obj.server_name+"_"+obj.cards.toLowerCase()+"_recovery.lock"
   var url=""

   write_to_log(String("getting MARS session from file "+url_file))
   console.log(String("waiting for rc file  "+rc_file))

   var rc_found = false
   setTimeout(function (){    //=========== first settimeout waiting for rc file to become 0
   for (i=0;i<20;i++){
      if(fs.existsSync(rc_file)){
          var data = fs.readFileSync(rc_file, 'utf8')
          if (String(data)== String(0)){
            write_to_log(String("rc found =  "+ data))
            rc_found=true
            i=60;
            }
            }
           }
         },1000);    

   var url_found = false
   setTimeout(function (){  //=========== second settimeout waiting for url file to be created
   for (j=0;j<20;j++){
      if(fs.existsSync(url_file)){
        url  = fs.readFileSync(url_file, 'utf8')
          if (url ==""){
            url_found=false;
          }
          else{   
        write_to_log(String("url found =  "+ url))
        url_found=true
        j = 60;
        res.send(JSON.stringify(url));
        }
        }
   }
    if (url == ""){
       write_to_log("Error url file NOT found, exiting ...")
       res.send(JSON.stringify(""));
       }
       },10000);    
  console.log("---------------------------------------")
  })
// ================================================ prepare_minireg ====================================================
app.post('/prepare_minireg', function (req, res) {
  var obj = req.body;
  console.log("prepare_minireg inputs = ", obj)
  //need to continue the mini reg here
  console.log("---------------------------------------")
})
 
// ================================================ Add_Admin_User ====================================================
app.post('/Add_Admin_User', function (req, res) {
  var obj = req.body;
  console.log("Add_Admin_User Works ")
  if (os.platform() == "win32"){
    var file = reader.readFile('//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Website_admin_users.xlsx')
  }
  else{
    var file = reader.readFile('/.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/Website_admin_users.xlsx')
  }
  try{
    //=======convert xlsx file to JSON
  var data = []
  const sheets = file.SheetNames
  for(var i = 0; i < sheets.length; i++)
  {   
  const temp = reader.utils.sheet_to_json(
  file.Sheets[file.SheetNames[i]])
  temp.forEach(function (res) {
  data.push(res)
  })  
  } 
   //=======check if user alrady exist
  var found=false
  for(var i = 0; i < data.length; i++){
    if(String(data[i].user) == String(obj.user_to_add)){
      found=true
    }
  }
  console.log(found)
  if(found==true){
    res.send(JSON.stringify("user_alrady_admin"))
  }
  //=======if user not exist add him and rewrite xlsx file
  else{
      // Sample data set
var user_data = {
  "user":obj.user_to_add,
}

console.log("data = ", data)

// Modify the xlsx 
 data.push(user_data)

 console.log("data = ", data)

  // ==== update the xlsx file
 reader.utils.sheet_add_json(file.Sheets["Sheet1"],data)
 if (os.platform() == "win32"){
   reader.writeFile(file,'//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Website_admin_users.xlsx')
     }
 else{
   reader.writeFile(file,'/.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/Website_admin_users.xlsx')
     }
     }
     write_to_log(String("user "+obj.user_to_add+" has been added to Admins list"))
     res.send(JSON.stringify("user_added"))
    } 
catch (err) {
  console.error(err)
  }
  console.log("---------------------------------------")
})
// ================================================ Delete_Admin_User ====================================================
app.post('/Delete_Admin_User', function (req, res) {
  var user_to_delete = req.body.user_to_delete
  console.log("Delete_Admin_User Works ")
  console.log("user to delete = ", user_to_delete)
    //=======define xlsx file to read
    if (os.platform() == "win32"){
      var file = reader.readFile('//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Website_admin_users.xlsx')
    }
    else{
      var file = reader.readFile('/.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/Website_admin_users.xlsx')
    }
    try{
      //=======convert xlsx file to JSON
    var data = []
    const sheets = file.SheetNames
    for(var i = 0; i < sheets.length; i++)
    {   
    const temp = reader.utils.sheet_to_json(
    file.Sheets[file.SheetNames[i]])
    temp.forEach(function (res) {
    data.push(res)
    })  
    } 
    
  // console.log("data = ", data)
  //=======
    for(var i = 0; i < data.length; i++)
  {   
    if(String(user_to_delete) == data[i].user){
      data.splice(i, 1); 
    }
  }
    console.log("data = ", data)
  // ==== update the xlsx file
  reader.utils.sheet_add_json(file.Sheets["Sheet1"],data)
  if (os.platform() == "win32"){
    reader.writeFile(file,'//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Website_admin_users.xlsx')
      }
  else{
    reader.writeFile(file,'/.autodirect//mswg/projects/fw/fw_ver/hca_system_service_db/Website_admin_users.xlsx')
      }
      res.send(JSON.stringify("user_deleted"))
     } 
 catch (err) {
   console.error(err)
   res.send(JSON.stringify("error"))
   }
   console.log("---------------------------------------")
 })
// ================================================ Close_ticket ====================================================
app.post('/Close_ticket', function (req, res) {
  var obj = req.body;

  write_to_log("Close_ticket function works")
  console.log("obj=",obj)
  // Reading our test file
  if (os.platform() == "win32"){
    var file = reader.readFile('//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Service_tickets.xlsx')
  }
  else{
    var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/Service_tickets.xlsx')
  }
    try{
      var data = []
      const sheets = file.SheetNames
      // console.log("sheets =",sheets)
    
      for(var i = 0; i < sheets.length; i++)
      {   
      const temp = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
      temp.forEach(function (res) {
      data.push(res)
      })  
      } 
      for(var i = 0; i < data.length; i++){       
        if(data[i].id === obj.id && data[i].assign_to === obj.assign_to && data[i].desc === obj.desc && data[i].subject === obj.subject && data[i].status === obj.status ){
     //     console.log("ticket found =", data[i])

          data[i].status="closed"
        }
      }
 
  //  update the xlsx file
    reader.utils.sheet_add_json(file.Sheets["Sheet1"],data)
    if (os.platform() == "win32"){
      reader.writeFile(file,'//10.4.0.102/swgwork/rmrih/fwrecovery_website/files/Service_tickets.xlsx')
    }
    else{
      reader.writeFile(file,'/mswg/projects/fw/fw_ver/hca_system_service_db/Service_tickets.xlsx')

    }
    // res.send(JSON.stringify(data));
    } 
    catch (err) {
      console.error(err)
    }
  console.log("---------------------------------------")
})
// ================================================ change_server_status_to_in_recovery ====================================================
app.post('/change_server_status_to_in_recovery', function (req, res) {
  var obj = req.body;
  write_to_log("change_server_status_to_in_recovery function works")
  if (os.platform() == "win32"){
    var file = reader.readFile('//10.4.0.102/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx')  
    }
    else{
      var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx') 
    }
    try{
      var data = []
      const sheets = file.SheetNames
      // console.log("sheets =",sheets)
    
      for(var i = 0; i < sheets.length; i++)
      {   
      const temp = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
      temp.forEach(function (res) {
      data.push(res)
      })  
      } 
    //  console.log("data =", data)

      for(var i = 0; i < data.length; i++){
        if(data[i].server_name == obj.server_name){
   //      console.log("data [i] =", data[i])
            data[i].status="in_recovery"
        }
      }
  
  //  update the xlsx file
    reader.utils.sheet_add_json(file.Sheets["Servers Data"],data)
    if (os.platform() == "win32"){
      reader.writeFile(file,'//10.4.0.102/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx')
    }
    else{
      reader.writeFile(file,'/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx')
    }
    } 
    catch (err) {
      console.error(err)
    }
    write_to_log(String("Server "+obj.server_name+" status has been changed to in recovery"))
    res.send(JSON.stringify("success"));
  console.log("---------------------------------------")

})
// ================================================ change_server_status_to_prepare_minireg ====================================================
app.post('/change_server_status_to_prepare_minireg', function (req, res) {
  var obj = req.body;
  console.log("change_server_status_to_prepare_minireg works")
  if (os.platform() == "win32"){
    var file = reader.readFile('//10.4.0.102/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx')  
    }
    else{
      var file = reader.readFile('/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx') 
    }
    try{
      var data = []
      const sheets = file.SheetNames
      // console.log("sheets =",sheets)
    
      for(var i = 0; i < sheets.length; i++)
      {   
      const temp = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
      temp.forEach(function (res) {
      data.push(res)
      })  
      } 
      // console.log("data =", data)

      for(var i = 0; i < data.length; i++){
        if(data[i].server_name == obj.server_name){
          data[i].status="preparing_minireg"
        }
      }

  //  update the xlsx file
    reader.utils.sheet_add_json(file.Sheets["Sheet1"],data)
    if (os.platform() == "win32"){
      reader.writeFile(file,'//10.4.0.102/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx')
    }
    else{
      reader.writeFile(file,'/mswg/projects/fw/fw_ver/hca_system_service_db/FW_servers_db.xlsx')
    }
    } 
    catch (err) {
      console.error(err)
    }
    res.send(JSON.stringify("success"));
  console.log("---------------------------------------")
})
// ================================================ Delete_server ====================================================
app.post('/Delete_server', function (req, res) {
  var obj = req.body;
  console.log("Delete_server input= ", obj)
  console.log("---------------------------------------")
})
// ================================================ Add_New_NOGA_Server ====================================================
app.post('/Add_New_NOGA_Server', function (req, res) {
    var obj = req.body;
    console.log("Add_New_NOGA_Server input= ", obj)
    console.log("---------------------------------------")
})
// ================================================ New_Redmine_Ticket ====================================================
app.post('/New_Redmine_Ticket', function (req, res) {
  var obj = req.body;
  console.log("New_Redmine_Ticket input = ", obj)
  console.log("---------------------------------------")
})
// ================================================ Add_New_MARS_Server ====================================================
app.post('/Add_New_MARS_Server', function (req, res) {
  var obj = req.body;
  console.log("Add_New_MARS_Server input = ", obj)
  cp.exec("ssh -l root l-fwreg-139 python /.autodirect/mswg/projects/fw/fw_ver/hca_system_service/BackEnd/Api.py --mode create_mars --mst_device "+obj.cards+" --server_name "+obj.server_name, function (error, stdout, stderr) {
    if (error) {
        console.log('error = ' , error);
        res.send(JSON.stringify(error));
        return;
    }
    if (stderr) {
        console.log('stderr = ',stderr);
        res.send(JSON.stringify(stderr));
        return;
    }
    if (stdout) {
        write_to_log(String('stdout = '+stdout));
        write_to_log("Finished adding new setup to MARS")
        res.send(JSON.stringify(stdout));
        return;
    }
});
  //res.send(JSON.stringify("success"));
  console.log("---------------------------------------")
})
// ================================================ Add_New_SLURM_Server ====================================================
app.post('/Add_New_SLURM_Server', function (req, res) {
  var obj = req.body;
  console.log("Add_New_SLURM_Server input = ", obj)
  console.log("---------------------------------------")
})
// ================================================================== Start session after login =======================================================================================
app.post('/loginSession', function (req, res) {
    sess = req.session;
    req.session.user_name = req.body.user_name; //params['email']; 
    req.session.mail = req.body.mail; //params['password'];
    sess.mail;
    sess.user_name;
    res.send(req.session.user_name + ":" + req.session.mail)
})
// ====================================================== send req email to grant Access ====================================================
app.post('/Send_Email_Admin_Req', function (req, res) {
    console.log("Send_Email_Req function works")
       var username = req.body.username
       var email = req.body.email
       var desc = req.body.desc
      write_to_log("Sending Admin access req for user "+username+" email "+email) //writing to log file with echo (if file exist)
      cp.exec("python /mswg/projects/fw/fw_ver/hca_system_service_db/scripts/send_mail_user_admin_request.py "+"'"+username+"' "+"'"+email+"' "+"'"+desc+"'", function(e, stdout, stderr) { 
      })
});
//====================================================== app port =============================================================================
app.listen(port, function(err){
    if (err) console.log("Error in nodejs server setup")
    if (os.platform() == "win32"){
      console.log("localhost:4200 web server listening on Port ", port);
    }
    else{
      write_to_log(String("http://systemservice website is listening on Port "+ port));
    }
})
                                                                                                                                                              
