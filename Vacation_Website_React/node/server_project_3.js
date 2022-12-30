const server2= require ('./server2-project-3.js');
const express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
const cors = require('cors');
var mysql=require('mysql');
const http = require('http')
const socketIO = require('socket.io')

app.use(cookieParser())

var corsOptions = {
  optionsSuccessStatus: 200,
  allowedHeaders:['sessionId','Content-Type'],
  exposedHeaders:['sessionId'],
  credentials:true,
}
// ====================================================== Socket emit changes ====================================================

// our server instance
const server = http.createServer(app)
const port = 5000
// This creates our socket using the instance of the server
const io = socketIO(server)
// This is what the socket.io syntax is like.
io.on('connection', socket => {
  console.log('Socket Connected')
  // just like on the client side, have a socket.on method that takes a callback function
  socket.on('UpdatedVacations', async (Vacations) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Updated Vacations: ', Vacations)
    let AllVacations=await server2.GetAllVacations();
    io.sockets.emit('UpdatedVacations', AllVacations);
  })
})
// =============================================== database configuration ===============================================================

app.use(cors(corsOptions))
var corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"project-3"
});
// ======================================================================================================================================
app.get('/checkCookie', function (req, res) {
  let checkCookie = req.cookies["id"];
  console.log("checkCookie=", checkCookie);
 
  if (checkCookie) {
      console.log("cookie found ",req.cookies)
      res.send(req.cookies);        
     } 
 
     else {
      console.log("no cookie")
      res.send(JSON.stringify("0"));       
  }
res.end()
})
// ====================================================== aync function get All users from database ====================================================
app.get('/getAllUsers', async (req,res)=>{
  userName = req.query.userName;
  password = req.query.password;
  let DBVUsers = await server2.getAllUsers();  
   res.send(DBVUsers);
  
});  
// ====================================================== insert from Regester page new user ====================================================
app.get('/insertNewUser',(req,res)=>{
  name = req.query.name;
  lastName = req.query.lastName;
  userName = req.query.userName;
  password = req.query.password;
  con.query(`INSERT INTO users (first_name,last_name,user_name,password) VALUES ('${name}','${lastName}','${userName}','${password}')`, function(err,result,fields){
   
    if (err) throw err;
    res.send(result);
});
})
// ======================================================= async function get all vacations from DB ============================================================================
app.get('/getAllVacations', async(req,res)=>{
  let DBVacations = await server2.getAllVactions();  
      res.send(DBVacations);
  });  
// ================================================ async function select the following vacations for User ==========================================================
app.get('/UserSortedVacations', async (req,res)=>{
  let ALL=[];
  con.query(`SELECT * FROM vacation`, function(err,result,fields){
    if (err) throw err; 
    ALL=result;
});
  let sortedArr=[]
  let Uid= req.query.Uid;
  console.log(' Uid = ' ,Uid)
  let DBUserVacations = await server2.UserSortedVacations(Uid);  
  
  for (let item of DBUserVacations)   
  {
     for(let item1 of ALL)
     {
       if (item.location===item1.location)
       {
         sortedArr.push(item1)     //Sorted array gets the following vacations first
       }
     } 
   }

 for (let item2 of ALL)
  {
   let found =false;
     for(let item3 of DBUserVacations)
     {
       if (item2.location===item3.location)
       {
         found=true;
       }
     } 
     if(found==false)
      sortedArr.push(item2)      //Sorted array gets the Unfollowing vacations after
   }
  
  console.log("sortedArr= ",sortedArr)
  res.send(sortedArr);
    });  
// =========================================================following vaction====================================
  
    app.get('/UserFollowingVacations',(req,res)=>{
  
      Uid = req.query.Uid;
      con.query(`SELECT * FROM users_vacation WHERE uid='${Uid}'`, function(err,result,fields){
        if (err) throw err; 
        res.send(result);
    });
    })
  
// =========================================================delete following vaction====================================
app.get('/UnfollowVacation',(req,res)=>{
  
  Uid = req.query.Uid;
  location=req.query.location
  console.log(Uid,location);
  con.query(`DELETE FROM users_vacation WHERE uid='${Uid}' AND location='${location}'`, function(err,result,fields){
    if (err) throw err; 
    res.send(result);
});
})
// =================================================== insert location by User id to DB ==========================================================
app.get('/InsertUserVacations',(req,res)=>{
  Uid = req.query.Uid;
  location = req.query.location;
  con.query(`INSERT INTO users_vacation (uid,location) VALUES ('${Uid}','${location}')`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
});
})
// =================================================Update image URL ==============================================================================================
app.get('/UpdateURL',(req,res)=>{
  URL = req.query.URL;
  Id=req.query.id
  con.query(`UPDATE vacation SET image='${URL}' WHERE id='${Id}'`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
});
})
// =================================================Update Location ==============================================================================================

app.get('/UpdateLocation',(req,res)=>{
  MainLocation=req.query.MainLocation 
  location=req.query.LocationDB
  con.query(`UPDATE vacation SET location='${location}' WHERE location='${MainLocation}'`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
    });
})
// =================================================Update Start Date ==============================================================================================

app.get('/UpdateStartDate',(req,res)=>{
  MainLocation=req.query.MainLocation 
  start_date=req.query.StartDateDB
  con.query(`UPDATE vacation SET start_date='${start_date}' WHERE location='${MainLocation}'`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
    });
})
// =================================================Update End Date ==============================================================================================

app.get('/UpdateEndDate',(req,res)=>{
  MainLocation=req.query.MainLocation 
  end_date=req.query.EndDateDB
  con.query(`UPDATE vacation SET end_date='${end_date}' WHERE location='${MainLocation}'`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
    });
})
// =================================================Update Discription  ==============================================================================================

app.get('/UpdateDiscription',(req,res)=>{
  MainLocation=req.query.MainLocation 
  discription=req.query.DiscriptionDB
  con.query(`UPDATE vacation SET title='${discription}' WHERE location='${MainLocation}'`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
    });
})
// =================================================== Update Price  ==============================================================================================

app.get('/UpdatePrice',(req,res)=>{
  MainLocation=req.query.MainLocation 
  price=req.query.PriceDB
  con.query(`UPDATE vacation SET price='${price}' WHERE location='${MainLocation}'`, function(err,result,fields){  
    if (err) throw err;  
    res.send(result);
    });
})
// ===================================================async function get all Vacations For Chart ==============================================================================================
app.get('/getVacationsForChart', async (req,res)=>{
  let DBAllUsersVacations = await server2.getAllUsersVacations();  
   res.send(DBAllUsersVacations);
});  

server.listen(port, () => console.log(`Listening on port ${port}`))
