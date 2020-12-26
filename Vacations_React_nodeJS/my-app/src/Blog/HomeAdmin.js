  import React, { Component } from 'react';
  import { Card, CardImg, CardTitle, CardText, CardDeck,CardSubtitle, CardBody } from 'reactstrap';
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter ,FormGroup,Label, Input} from 'reactstrap';
  import {  Route,Link,Redirect } from 'react-router-dom';
  import Login_Project from './Login_Project';
  import axios from "axios";
  import './HomeAdmin.css';
  import ModalText from './ModalText';
  import './ModalText.css'
  import ModalImage from './ModalImage';
  import Chart_project from './Chart_project';
  import Cookies from 'js-cookie';
  import socketIOClient from "socket.io-client";

  class HomeAdmin extends Component {
    constructor() {
    super();  
    this.state={
        foundVacations:[],
        userVacations:[],
        Uid:"",
        endpoint: "localhost:5000",
        LocationDB:"",
        StartDateDB:"",
        EndDateDB:"",
        DiscriptionDB:"",
        PriceDB:"",
        modal: false,
        NoUserFlag:false,
        UserCookies: Cookies.get('id'),
      };
      }
  send = () => {          //==================================Send to socket
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('UpdatedVacations', this.state.foundVacations)
  }

  componentDidMount=()=>{ //=========================componentDidMount gets all vacations and lables for Chart
       
      if(localStorage.UserID){
      let Userid = JSON.parse(localStorage.UserID) 
      this.setState.Uid=Userid
        
      axios.get(`http://localhost:5000/getAllVacations`)      //all vacations
        .then(response => {  
          this.setState({foundVacations:response.data})
        
          const socket = socketIOClient(this.state.endpoint);
          setInterval(this.send(), 1000)
          socket.on('UpdatedVacations', (SocketVacations) => {
            this.setState({foundVacations:SocketVacations})
          });
          socket.emit('UpdatedVacations', this.state.foundVacations)
          
        })
        .catch(error => {
          console.log("error: ", error);
        })  
      
    
        {   
          axios.get(`http://localhost:5000/getVacationsForChart`)
          .then(response => {  
          this.setState({AllVacations: response.data});
          console.log("this.state.AllVacations",this.state.AllVacations)
          let allVacations2 = [] 
          for (let item of this.state.AllVacations){ //this loop is to take only vactions name for chart lables
          allVacations2.push(item.location) 
            }
            this.state.AllVacations2= allVacations2;
      })
          .catch(error => {
            console.log("error: ", error);
            })  
          
          }
        }
        else{
        this.setState({NoUserFlag:true})
        }
         
          }   
  // ======================================================== Print cards  ==================================================
  printRes=()=>{ 
  let printArray = [];
  let AllVacations =this.state.foundVacations;

    for (let item of AllVacations)
    {
    let StartDate=item.start_date.substring(0,10) //this function cut the date to normal without zone time
    let EndDate=item.end_date.substring(0,10)
      
    printArray.push(                              //print array contain cards return to html
    <div className="mycard col-md-4 col-sm-12">
    <Card className="mycard3"> 
    <CardBody className="p-2">
    <CardTitle>
      
    <h3><ModalText  send={this.send}  location={item.location} start_date={StartDate} end_date={EndDate} title={item.title} price={item.price} image={item.image} isOpen={this.state.isOpen}  onClose={(e)=>this.setState({isOpen:false})}></ModalText></h3></CardTitle>
    <div class="container">
    <CardImg className="p-0" top  width="100%" height="250px" src={item.image} alt="Card image cap" />
    <div className="overlay">
    <a href="#" className="icon" title="Change image">
    <ModalImage  send={this.send} isOpen={this.state.isOpen} id={item.id} onClose={(e)=>this.setState({isOpen:false})}></ModalImage>
    </a>
    </div>
    </div>
    <CardSubtitle ><h5 className="pl-3 pt-1">From :{StartDate}</h5></CardSubtitle>
    <CardSubtitle><h5 className="pl-3 pt-1">To :{EndDate}</h5></CardSubtitle>
    <CardSubtitle ><bold><h3 className="pl-3 pt-1">Price :{item.price} $</h3></bold></CardSubtitle>
    <CardText><h4 className="pl-3">{item.title}</h4></CardText>
    </CardBody>
    </Card>
    </div>
         )  
        }
return printArray; 
        }
   // ======================================================== Logout function  ==================================================
lOGOUT = ()=>{
  Cookies.remove('id');
  localStorage.removeItem('UserID');
  localStorage.isLoggedIn = JSON.stringify(false)
  
} 
   // ======================================================== Render ==================================================

    render() {
  if(this.state.NoUserFlag){
  this.setState({NoUserFlag:false})
  return  <Redirect to="/"/>
  }
      return (
      <div>
      <div className="Header mt-3">
      <h1>This is Admin home page</h1>
      <button type="submit" class="btn btn-outline-success" onClick={this.lOGOUT}><Link to="/" style={{color: "white"}}>LOG-OUT</Link></button>
      <button type="submit" class="ml-3 btn btn-outline-success"><Link to="/Chart_project" style={{color: "white"}}>Go to chart</Link></button>     
      </div>
      <div className="row">    
      <div className="col-12">
      {this.printRes()}
      </div> 
      </div>     
     </div>
      );
    };
  }  
  export default HomeAdmin;
