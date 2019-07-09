import { Navbar, Nav,Button,Form,FormControl } from 'react-bootstrap';
import React from 'react';
import buscar from '../img/buscar.svg';
class NavBar extends React.Component {
    render() {
      return (
        <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Gestión Electivas</Navbar.Brand>
          <Nav className="mr-auto">
            
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info"><img src={buscar} /></Button>
            
            <Button className = "ml-2" variant="danger">Cerrar Sesión</Button>
          </Form>
        </Navbar>
        <br />
               
      </>
      );
    }
  }




export default NavBar;