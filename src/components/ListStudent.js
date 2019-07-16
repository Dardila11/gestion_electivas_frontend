import React, { Component } from 'react';
import {Image, Button, Table, Modal} from 'react-bootstrap';
// import axios from 'axios';

import AddStudent from './AddStudent';

export default class ListStudent extends Component {
  constructor(props,context){
    super(props,context);
    this.state = {
        show: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleClose() {
    this.setState( {show: false} );
  }

  handleShow() {
    this.setState( {show: true} );
  }

  render() {
    return (
        <>
        <div className="title pt-4 mb-2">
        <h5 className="d-inline white">Gestionar estudiantes</h5>
        <Button className="d-inline float-right btn btn-light mb-2 ml-2"><Image src="./img/mas.png" alt=""/></Button>
        <Button className="d-inline float-right btn btn-light mb-2" onClick={ this.handleShow }><Image src="./img/mas.png" alt=""/></Button>
        </div>
        <Table striped bordered hover responsive="xl" size="xl">
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>104613020476</td>
              <td>Miller Daniel</td>
              <td>Quilindo Velasco</td>
              <td>
                <Button className="btn mr-2 beige"><Image src="./img/ver.png" alt=""/></Button>
                <Button className="btn mr-2 beige"><Image src="./img/editar.png" alt=""/></Button>
                <Button className="btn beige"><Image src="./img/borrar.png" alt=""/></Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <Modal show={ this.state.show } onHide={ this.handleClose }>
          <Modal.Header closeButton>
            <Modal.Title>Registrar estudiante</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddStudent/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={ this.handleClose }>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        </>
    );
  }
}