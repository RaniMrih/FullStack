import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Blog from './Blog/Blog'
//===============================APP goes to Blog componnent==============================================//
class App extends Component {
  render() {      
    return (
    <BrowserRouter>
    <div>
      <Blog></Blog>   
    </div>
    </BrowserRouter>
    );
  }
}
export default App;
