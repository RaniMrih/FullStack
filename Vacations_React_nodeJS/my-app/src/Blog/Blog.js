import React, { Component } from 'react';
import { Route, Link , Switch} from 'react-router-dom';
import './Blog.css';
import Regester from './Regester'
import Login_Project from './Login_Project'
import HomeAdmin from './HomeAdmin'
import HomeUser from './HomeUser'
import Chart_project from './Chart_project'

//==============================Blog contain Routes for project==============================================================//
class Blog extends Component {
    render () {
        return (
    <div className="Blog MainBlog">
        <Switch>
        <Route path="/" exact component={Login_Project} />
        <Route path="/Regester" exact component={Regester} />
        <Route path="/HomeAdmin" exact component={HomeAdmin} />
        <Route path="/HomeUser" exact component={HomeUser} />
        <Route path="/Chart_project" exact component={Chart_project} />
        </Switch>
    </div>
    );
    }
   }
export default Blog;