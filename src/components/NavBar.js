import { Navbar, Nav,Button,Form,FormControl } from 'react-bootstrap';
import React from 'react';
import buscar from '../img/buscar.svg';
import { Redirect } from "react-router-dom";
class NavBar extends React.Component {
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
        <>
        <Navbar className="navbar" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Gestión Electivas</Navbar.Brand>
          <Nav className="mr-auto">
            
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info"><img src={buscar} alt="buscar" /></Button>
            
            
          </Form>
          <Button className = "ml-2" variant="danger" onClick={this.logout}>Cerrar Sesión</Button>
        </Navbar>
        <br />    
      </>
      );
    }
  }




export default NavBar;