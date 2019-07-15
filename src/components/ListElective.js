import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {Image, InputGroup, Button, Form, FormControl, Container, Table} from 'react-bootstrap';
import axios from 'axios';

export default class ListElective extends Component {
    render() {
        return (
            <>
            <div className="title pt-4 mb-2">
            <h5 className="d-inline white">Gestionar electivas</h5>
            <Button className="d-inline float-right btn btn-light mb-2"><Image src="./img/mas.png" alt=""/></Button>
            </div>
            <Table striped bordered hover responsive="xl" size="xl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>SIS-483</td>
                  <td>Minería de Datos</td>
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