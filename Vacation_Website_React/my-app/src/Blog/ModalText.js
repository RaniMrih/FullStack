import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter ,FormGroup,Label, Input} from 'reactstrap';
import axios from "axios";
import './ModalText.css'
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';
import socketIOClient from "socket.io-client";
import { Route, Link , Redirect} from 'react-router-dom';

class ModalText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      Refresh:false,
      LocationDB:"",
      StartDateDB:"",
      EndDateDB:"",
      DiscriptionDB:"",
      PriceDB:"",
      endpoint: "localhost:5000",
      // RefreshSokcet:false,
    };
    this.toggle = this.toggle.bind(this);
    }
// ======================================================== socketIOClient  ==================================================

// =================================================================================
  toggle() {
    // console.log( ",this.state.sRefreshSokcet = ",this.state.RefreshSokcet);
    this.setState(prevState => ({
      modal: !prevState.modal,          
    }));
   }
// ================================================================================= 
  handleChange = (event) => {
    if(event.target.id === "1"){
       this.setState({LocationDB: event.target.value});
        console.log( "LocationDB = ",this.state.LocationDB);
    }
    if(event.target.id === "2"){
        this.setState({StartDateDB: event.target.value});
        console.log("StartDateDB = ",this.state.StartDateDB);
    } 
    if(event.target.id === "3"){
        this.setState({EndDateDB: event.target.value});
        console.log("EndDateDB = ",this.state.EndDateDB);
      } 
    if(event.target.id === "4"){
        this.setState({DiscriptionDB: event.target.value});
        console.log("DiscriptionDB = ",this.state.DiscriptionDB);
        } 
    if(event.target.id === "5"){
          this.setState({PriceDB: event.target.value});
          console.log("PriceDB = ",this.state.PriceDB);
          } 
         }
// =============================== Update vacation parameters (location, start, end, discription, price) ===========================================================
   UpdateVacaion =() =>{
   if (this.state.LocationDB===""&&this.state.StartDateDB===""&&this.state.EndDateDB===""&&this.state.DiscriptionDB===""&&this.state.PriceDB==="")
   {
     alert("Fields are empty, NO changes made")
   } 
   else{
    let MainLocation =this.props.location;
    
    if (this.state.LocationDB != ""){
         axios.get(`http://localhost:5000/UpdateLocation/?MainLocation=${MainLocation}&LocationDB=${this.state.LocationDB}`)
            .then(function(response){
                // console.log(response.data);              
                })
                .catch(function(error){
                  console.log(error);
                });
              }     
    if (this.state.StartDateDB != ""){
      axios.get(`http://localhost:5000/UpdateStartDate/?MainLocation=${MainLocation}&StartDateDB=${this.state.StartDateDB}`)
          .then(function(response){
              // console.log(response.data);
              
              })
              .catch(function(error){
                console.log(error);
              });
            }    
    if (this.state.EndDateDB != ""){
        axios.get(`http://localhost:5000/UpdateEndDate/?MainLocation=${MainLocation}&EndDateDB=${this.state.EndDateDB}`)
            .then(function(response){
                console.log(response.data);
                
                })
                .catch(function(error){
                  console.log(error);
                });
              }     
    if (this.state.DiscriptionDB != ""){
        axios.get(`http://localhost:5000/UpdateDiscription/?MainLocation=${MainLocation}&DiscriptionDB=${this.state.DiscriptionDB}`)
            .then(function(response){
                console.log(response.data);         
                })
                .catch(function(error){
                  console.log(error);
                });
              }    
    if (this.state.PriceDB != ""){
        axios.get(`http://localhost:5000/UpdatePrice/?MainLocation=${MainLocation}&PriceDB=${this.state.PriceDB}`)
            .then(function(response){
                console.log(response.data);
                
                })
                .catch(function(error){
                  console.log(error);
                });
              }                 
             this.props.send()
            //  this.setState({Refresh:true})
              this.toggle()
              // this.props.componentDidMount();
             
              }
            }
  // ====================================================================================================================================
  render() {
    if(this.state.Refresh==true){
      this.setState({Refresh:false})
      // return this.props.componentDidMount
    }
    return (
   
      <div>
        
      <i className="fas fa-align-justify myIconA mr-2" onClick={this.toggle}></i>{this.props.location}
        <Modal isOpen={this.state.modal}  toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Modify the vacation</ModalHeader>
          <ModalBody>
          <FormGroup>
          <Label for="'exampleEmail">Location :</Label>
          <Input type="text" id="1" placeholder={this.props.location} onChange={this.handleChange} />
          <Label for="'exampleEmail">Start Date :</Label>
          <Input type="text"  id="2" placeholder={this.props.start_date} onChange={this.handleChange} />
          <Label for="'exampleEmail">End Date :</Label>
          <Input type="text"  id="3" placeholder={this.props.end_date} onChange={this.handleChange} />
          <Label for="'exampleEmail">Discription :</Label>
          <Input type="text"  id="4" placeholder={this.props.title} onChange={this.handleChange} />
          <Label for="'exampleEmail">Price :</Label>
          <Input type="number"  id="5" placeholder={this.props.price + "$"} onChange={this.handleChange} />
        </FormGroup>
          </ModalBody>
          <ModalFooter>            
            <Button type="submit" color="primary"  onClick={() =>this.UpdateVacaion(this.props.id)}>Save</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default ModalText;