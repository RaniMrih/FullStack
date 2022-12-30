import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter ,FormGroup,Label, Input} from 'reactstrap';
import axios from "axios";
import './ModalImage.css';
import socketIOClient from "socket.io-client";

class ModalImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      Refresh :false,
      imageURL:"",
      endpoint: "localhost:5000",
      foundVacations:[]
      // RefreshSokcet:false,
      // flag:0,
      // location:props.item.locations,
      
    };
  // =================================================================================
  this.toggle = this.toggle.bind(this);
  }

  componentDidMount=()=>{
    {   
    
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
      }
    }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal    
    }));
  }
  
  handleChange = (event) => {
      this.setState({imageURL: event.target.value});
    console.log( "name = ",this.state.imageURL);
}
send = () => {
  const socket = socketIOClient(this.state.endpoint);
  socket.emit('UpdatedVacations', this.state.foundVacations)
}
// =====================================================Update the image adress=================================
UpdateImage =() =>{
if (this.state.imageURL == ""){
  alert("URL is empty , Enter new URL")
}
else{
  console.log("New URL = ",this.state.imageURL);
        axios.get(`http://localhost:5000/UpdateURL/?URL=${this.state.imageURL}&id=${this.props.id}`)
        .then(function(response){
            console.log(response.data);
            
           })
           .catch(function(error){
              console.log(error);
           });
          }
          this.props.send()
          this.toggle()
          }
// ================================================================================================================
  

  render() {
    return (
      <div>
        {/* <i className="fas fa-align-justify"></i> */}
      <i className="fas fa-align-justify myIconA mr-2" onClick={this.toggle}></i>{this.props.location}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
         
          <ModalHeader toggle={this.toggle}>Enter new image URL :</ModalHeader>
          <ModalBody>
          <FormGroup>
          <Label for="exampleText">URL :</Label>
          <Input type="textarea" name="text" id="exampleText" onChange={this.handleChange}  />
        </FormGroup>
          </ModalBody>
          <ModalFooter>            
            <Button color="primary"  onClick={() =>this.UpdateImage()}>Save</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalImage;