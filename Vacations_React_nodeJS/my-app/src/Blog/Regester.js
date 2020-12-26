import React from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert  } from 'reactstrap';
import {  Route,Link , Redirect , Switch} from 'react-router-dom';
import Login_Project from './Login_Project'
import HomeUser from './HomeUser'
import './Regester.css'
import axios from "axios";

export default class Example extends React.Component {
  state={
    name:"",
    lastName:"",
    userName:"",
    password:"",
    fieldsOk:false,
}
handleChange = (event) => {
    if(event.target.id === "examplName"){
    this.setState({name: event.target.value});
    console.log( "name = ",this.state.name); 
    }
    if(event.target.id === "exampleLastName"){
    this.setState({lastName: event.target.value});
     console.log("LastName = ",this.state.lastName);
    } 
    if(event.target.id === "exampleUserName"){
      this.setState({userName: event.target.value});
       console.log("User Name = ",this.state.userName);
      } 
    if(event.target.id === "examplePassword"){
        this.setState({password: event.target.value});
         console.log("password = ",this.state.password);
        } 
       }
// ====================================== Regester new user ============================================================
handelsubmit=()=>
{ 
  let name=this.state.name;
  let lastName=this.state.lastName;
  let userName=this.state.userName;
  let password=this.state.password;
  if(name==="" || lastName==="" ||userName==="" ||password===""){
    console.log(this.state.fieldsOk)
    this.state.fieldsOk=false;
   alert ("All fields are mandatory")
  }
  else{
    this.setState({fieldsOk:true})
    console.log(this.state.fieldsOk)
  axios.get(`http://localhost:5000/insertNewUser?name=${name}&lastName=${lastName}&userName=${userName}&password=${password}`)
  .then(function(response){
     })
  .catch(function(error){
     console.log(error);
     });
}
// return  <Redirect to="/HomeUser"/>
  // this.componentDidMount();
  // this.printRes();
}
// =================================================================================================================
  render() {
    if(this.state.fieldsOk==true){
    return  <Redirect to="/HomeUser"/>
    }
    return (
        <div className="container">  
        <div className="box1 offset-3 col-6">
        <div className="container mt-2">
      <Form>
        <Row form>
          <Col md={12}>
            <FormGroup>
            <Label className="label1">Name</Label>
              {/* <Label for="exampleName">Name</Label> */}
              <Input type="text" name="name" id="examplName" placeholder="First name" onChange={this.handleChange} />
            </FormGroup>
          </Col>
          </Row>
          <Row form>
          <Col md={12}>
            <FormGroup>
              <Label className="label1">Last name</Label>
              <Input type="text" name="lastName" id="exampleLastName" placeholder="Last placeholder" onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
        <Col md={12}>
            <FormGroup>
              <Label className="label1">User name</Label>
              <Input type="text" name="userName" id="exampleUserName" placeholder="User" onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
          <FormGroup>
                <Label className="label1">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="********"
                  onChange={this.handleChange} 
                />
              </FormGroup>
          </Col>                                                          
          </Row>
        <button type="button2" className="" onClick={() =>this.handelsubmit()}>Regester Now</button> 
      </Form>
      <button type="button2" className=""><Link to="/" style={{color: "white"}}>Back to Login</Link></button> 
      </div>
      </div>
      <Switch>
      <Route path="/" exact component={Login_Project} />
      {/* <Route path="/HomeUser" exact component={HomeUser} /> */}
      </Switch>
      </div>
      
    );
  }
}