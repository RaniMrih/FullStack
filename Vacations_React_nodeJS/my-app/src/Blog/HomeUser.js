import React, { Component } from 'react';
import { Route, Link ,Redirect} from 'react-router-dom'
import { Card, CardImg, CardTitle, CardText, CardDeck,CardSubtitle, CardBody } from 'reactstrap';
import'./Login_Project.css';
import axios from "axios";
import Blog from './Blog'
import Login_Project from './Login_Project'
import'./HomeUser.css';
import Cookies from 'js-cookie';
import socketIOClient from "socket.io-client";

class HomeUser extends Component {        
state={
foundVacations:[],
userVacations:[],
follow:false,
Uid:"",
Refresh:false,
SortedArr:[],
endpoint: "localhost:5000",
collapse:false,
UserCookies: Cookies.get('id'),
}

// ============================ DidMount brings all vacation sorted from server and User following Vacations ==================================================
componentDidMount=()=>{ 
  if(localStorage.UserID){
    let Userid = JSON.parse(localStorage.UserID) 
    this.setState({Uid:Userid})
    console.log("Userid =" ,this.state.Uid)
    axios.get(`http://localhost:5000/UserSortedVacations?Uid=${Userid}`)
    .then(response => {  
     this.setState({SortedArr:response.data}); 
    })
    .catch(error => {
    console.log("error: ", error);
    }) 
    axios.get(`http://localhost:5000/UserFollowingVacations?Uid=${Userid}`)
    .then(response => {  
    this.setState({userVacations: response.data});
    })
    .catch(error => {
      console.log("error: ", error);
    })  
    const socket = socketIOClient(this.state.endpoint);
    setInterval(this.send(), 1000)
    socket.on('UpdatedVacations', (SocketVacations) => {
    console.log('Socket Changes!')
    this.setState({foundVacations:SocketVacations})
  
     });
    socket.emit('UpdatedVacations', this.state.foundVacations) 
    } 
    else{
      this.setState({NoUserFlag:true})
      }  
    }
// ========================================================send to socket ==================================================

    send = () => {
      const socket = socketIOClient(this.state.endpoint);
      socket.emit('UpdatedVacations', this.state.foundVacations)
    }
// ========================================================Follow vacation ==================================================

FollowVacation=(location)=>{
  {   
    axios.get(`http://localhost:5000/InsertUserVacations?Uid=${this.state.Uid}&location=${location}`)
    .then(response => {  
      this.setState({foundVacations: response.data});
      this.setState({Refresh:true}) 
      this.state.Refresh=true;
    })
    .catch(error => {
      console.log("error: ", error);
    })  
    }
    }
// ========================================================UnFollow vacation ==================================================
UnFollowVacation=(location)=>{
  {   
    axios.get(`http://localhost:5000/UnfollowVacation?Uid=${this.state.Uid}&location=${location}`)
    .then(response => {  
      this.setState({foundVacations: response.data});
      this.setState({Refresh:true})
      this.state.Refresh=true;
    })
    .catch(error => {
      console.log("error: ", error);
    })    
    } 
  }
// ======================================================== Print cards  ==================================================
printRes=()=>{ 
 
  let printArray = [];
   for (let item of this.state.SortedArr)
        {
     printArray.push(
    <div className="mb-5 mycard col-md-4 col-sm-12">
      <Card className="mycard3 mb-5"> 
      <CardBody className="p-2">
      <CardTitle><h3>{item.location}</h3></CardTitle>
      <div class="container">
      <CardImg className="p-0" width="100%" height="250px"  src={item.image} alt="Card image cap"/>
      </div>
      <CardSubtitle><h4 className="mt-2">From : {item.start_date}</h4></CardSubtitle>
      <CardSubtitle><h4>To : {item.end_date}</h4></CardSubtitle>
      <CardSubtitle ><bold><h3 className="pt-1">Price :{item.price} $</h3></bold></CardSubtitle>
      <CardText>{item.title}</CardText>
      {this.buttonType(item.location)}
      </CardBody>
      </Card>
      </div>
         )    
        }
      console.log("printArray=" , printArray)
      return printArray; 
       }
// =================================================follow button / Unfollow button======================================================
  buttonType=(location)=>{
    let UserVacations=[]
    let button;
  
    UserVacations=this.state.userVacations
       
  if (UserVacations.length == 0 ){        //check if user following vacations
      button=<button className="offset-4 btn btn-primary" id="BBB" type="button" onClick={() =>this.FollowVacation(location)}>Follow Vacation</button>
      return button; 
    }
  else {                                           
      for(let item of UserVacations){
      if(item.location === location){
      button =<button className="offset-4 btn btn-danger" id="AAA" type="button" onClick={() =>this.UnFollowVacation(location)}> Un-Follow</button>            
      return button;
      }
      }
      button=<button className="offset-4 btn btn-primary" id="BBB" type="button" onClick={() =>this.FollowVacation(location)}>Follow Vacation</button>         
      return button;
        }
        }  
        
 // ======================================================== Logout function  ==================================================
lOGOUT = ()=>{
  Cookies.remove('id');
  localStorage.removeItem('UserID');
  
} 
// ======================================================== render ==================================================
render() {

  if(this.state.Refresh == true){       //this changes the state and refresh the page after button clicked
    this.setState({Refresh:false})
    this.componentDidMount()
     }
     if(this.state.NoUserFlag){
      this.setState({NoUserFlag:false})
      return  <Redirect to="/"/>
      }
   
    console.log("this.state.UserCookies",this.state.UserCookies)
       return (
      <div className="ml-5 mr-5">
      <div>
      <div className="offset-4">
      <h1>This is User home page</h1>
      <button type="button" class="mt-2 offset-2 btn btn-outline-success" onClick={this.lOGOUT}><Link to="/" style={{color: "white"}}>LOG-OUT</Link></button>  
      </div>
      <hr></hr>
      <div className="row">
      <div className="col-12">
      {this.printRes()}
      </div>   
      </div>      
      <div className="row">
      </div>
      </div> 
      </div>
        );
      };
    }  
  export default HomeUser;



