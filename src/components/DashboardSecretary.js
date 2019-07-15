import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import '../css/DashboardSecretary.css';
import NavBar from './NavBar';
import Nav from './Nav';


export default class DashboardSecretary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
    };
  }

  componentWillMount() {
    const token = JSON.parse(localStorage.getItem('token'));
    axios.post('http://localhost:8000/api/verificate/', { "token": token })
    .catch(error => {
        this.setState({ isLogin: false });
    });
  }

  render() {
    if (!this.state.isLogin){
      return <Redirect to='/'/>;
    }
    return (
      <div className="hmi-100">
        <NavBar/>
        <Nav/>
      </div>
    )
  }
}