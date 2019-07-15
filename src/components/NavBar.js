import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

import {Image, InputGroup, Button, Nav, Navbar, Form, FormControl, Container} from 'react-bootstrap';

export default class NavBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        redirect: false
    };
    this.logout = this.logout.bind(this);
  }

  logout(event){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('saliendo');
    this.setState({ redirect: true });
  }

  componentWillMount() {
    console.log('call create')
    console.log(this.state.redirect)
  }

  componentWillUnmount() {
    console.log('call destroy')
    console.log(this.state.redirect)
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/'/>;
    }
    return (
      <Navbar>
        <Navbar.Brand>
            <InputGroup.Checkbox name="boton-show" id="boton-show"/>
            <Form.Label className="mouse d-inline mr-2" htmlFor="boton-show"><Image src="../img/menu.png" alt=""/></Form.Label>
            <p className="d-inline m-0">SGE</p>
        </Navbar.Brand>
        <Form inline>
          <FormControl className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Search"/>
          <Button className="btn btn-success my-2 my-sm-0" type="submit">Buscar</Button>
          <Button className="btn btn-danger my-2 my-sm-0 ml-1" type="button" onClick={ this.logout }>Cerrar</Button>
        </Form>
      </Navbar>
    );
  }
}