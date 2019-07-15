import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {Image, InputGroup, Button, Form, FormControl, Container, Table} from 'react-bootstrap';
import axios from 'axios';

export default class ListClassroom extends Component {
    render() {
        return (
            <>
            <div className="title pt-4 mb-2">
            <h5 className="d-inline white">Gestionar Salones</h5>
            <Button className="d-inline float-right btn btn-light mb-2"><Image src="./img/mas.png" alt=""/></Button>
            </div>
            <Table striped bordered hover responsive="xl" size="xl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>No. Salón</th>
                  <th>Capacidad</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>102 IPET</td>
                  <td>34</td>
                  <td>
                    <Button className="btn mr-2 beige"><Image src="./img/ver.png" alt=""/></Button>
                    <Button className="btn mr-2 beige"><Image src="./img/editar.png" alt=""/></Button>
                    <Button className="btn beige"><Image src="./img/borrar.png" alt=""/></Button>
                  </td>
                </tr>
              </tbody>
            </Table>
            </>
        );
    }
}