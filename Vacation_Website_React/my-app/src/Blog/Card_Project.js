import React from 'react';
import { Button} from 'reactstrap';
import { Card, CardImg, CardTitle, CardText, CardDeck,CardSubtitle, CardBody } from 'reactstrap';
import {  Route,Link } from 'react-router-dom';
import Login_Project from './Login_Project'
import './HomeAdmin.css'



const Card_Project = (props) => {
  return (
      <div className="container">
      <h1>This is Admin home page</h1>
      <div>
<Card>
  <CardImg top width="100%" src={props.image} alt="Card image cap" />
  <CardBody>
    <CardTitle>{props.title}</CardTitle>
    <CardSubtitle>Card subtitle</CardSubtitle>
    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
    <Button>עקוב אחר חופשה</Button>
  </CardBody>
</Card>
</div>
     <button type="button"><Link to="/">Back to Login</Link></button>
     <Route path="/" exact component={Login_Project} />
     </div>
  );
};

export default Card_Project;
