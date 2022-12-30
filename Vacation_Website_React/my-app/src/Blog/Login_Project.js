import React, { Component } from 'react';
import { Route, Link , Redirect} from 'react-router-dom';
import {Container, Col, Form,FormGroup, Label, Input,Button,} from 'reactstrap';
import Regester from './Regester'
import'./Login_Project.css';
import axios from "axios";
import HomeAdmin from './HomeAdmin'
import HomeUser from './HomeUser'
import Cookies from 'js-cookie';

class Login_Project extends Component {
        
state={
    userName:"",
    password:"",
    foundUsers:[],
    isAdmin:false,
    UserCookies: Cookies.get('id'),
   }
//================================================================componentDidMount=============================================================================
     componentDidMount=()=>{
    
        if(!localStorage.UserID){
      axios.get(`http://localhost:5000/getAllUsers`)
      .then(response => {  
        this.setState({foundUsers: response.data});
         localStorage.AllUsers = JSON.stringify(response.data); // insert to local storage the users found
         
        })
      .catch(error => {
        console.log("error: ", error);
         })  
        }  
        else{
          
        }
      }    
       
// ========================================================= seting state with name and password ===================================================  
       handleChange = (event) => {
         if(event.target.id === "exampleUserName"){
         this.setState({userName: event.target.value});
            } 
         if(event.target.id === "examplePassword"){
         this.setState({password: event.target.value});
         } 
        }
//  ========================================================== Submit button =====================================================================      
       handelsubmit=()=>{ 
        let password=this.state.password;
        let userName=this.state.userName;
        
        for (let item of this.state.foundUsers) {                 //=====Compare username and password 
          if(item.user_name===userName && item.password===password){   
      
            if (item.role=="1")
                 {
                  Cookies.set('id', item.id, { expires: 1 });
                  this.setState({isAdmin: true});
                  this.state.isAdmin=true;  
                  localStorage.UserID=JSON.stringify(item.id);     //====save Admin id to localstorage
                 } 
                 else 
                   {
                    Cookies.set('id', item.id, { expires: 1 });
                     this.setState({isAdmin: false});
                    this.state.isAdmin=false;  
                     localStorage.UserID=JSON.stringify(item.id);   //====save User id to localstorage
                   }          
                  }   
                 }
                }
//  =================================================================== render =================================================================         
  render() {
  
    if (this.state.UserCookies == 1 ){   // redirect to Admin/User
      return  <Redirect to="/HomeAdmin"/>
    }
    if (this.state.UserCookies > 1 ){   // redirect to Admin/User
      return  <Redirect to="/HomeUser"/>
    }
    return (
      <div className="Main">                  
      <Container className="App">
      <div className="row">
      <div className="box col-lg-4 col-md-6 ">
        <h2 className="mb-2">LOGIN</h2>
        <Form className="form">
          <Col>
            <FormGroup>
              <Label className="label1">User name</Label>       
             <input type="text" name="userName" id="exampleUserName" placeholder="Enter user name" onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label className="label1">Password</Label>
              <input type="password" name="password" id="examplePassword" placeholder="****" onChange={this.handleChange}  />
            </FormGroup>
          </Col>
         <button type="button1" className="offset-5" onClick={() =>this.handelsubmit()}>login</button>
         <button type="button" className="btn btn-primary offset-1 " ><Link to="/Regester" style={{color: "white"}}>Regester Now</Link></button> 
        </Form>
        </div>
        </div>
      </Container>
      <Route path="/Regester" exact component={Regester} />
      <Route path="/HomeUser" exact component={HomeUser} />
      <Route path="/HomeAdmin" exact component={HomeAdmin} />
      </div>    
    );
  }
}    
export default Login_Project;



