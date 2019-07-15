import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {Image, InputGroup, Button, Form, FormControl, Container, Table} from 'react-bootstrap';
import axios from 'axios';

import '../css/DashboardSecretary.css';
import NavBar from './NavBar';
import Nav from './Nav';


export default class DashboardSecretary extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
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

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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