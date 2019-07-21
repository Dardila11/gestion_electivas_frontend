import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';

export default class addStudentStudent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            codigo: 104613020476,
            nombres: "Miller Daniel",
            apellidos: "Quilindo Velasco",
            email: "mdquilindo@unicauca.edu.co"
        };
        this.addStudent = this.addStudent.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: [event.target.value] });
    }

    addStudent(event) {
        event.preventDefault();
        const { codigo, nombres, apellidos, email } = this.state;
        var data = {
            "codigo": codigo,
            "nombres": nombres,
            "apellidos": apellidos,
            "email": email
        }
        axios.post('http://localhost:8000/api/classroom/', data)
            .then(function (response) {
                console.log(response);
            });
    }

    render() {
        return (
            <div className="container-fluid">
                <Form onSubmit={this.addStudent}>
                    <Row className="mb-3">
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Código</span></Form.Label>
                                <Form.Control className="ml-0" type="number" name="codigo" value={this.state.codigo} onChange={this.handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Correo</span></Form.Label>
                                <Form.Control className="ml-0" type="email" value={this.state.email} onChange={this.handleChange} required></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Nombres</span></Form.Label>
                                <Form.Control className="ml-0" type="text" name="nombres" value={this.state.nombres} onChange={this.handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Apellidos</span></Form.Label>
                                <Form.Control className="ml-0" type="text" value={this.state.apellidos} onChange={this.handleChange} required></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button className="rounded-10" variant="primary" type="submit">Registrar</Button>
                </Form>
            </div>
        );
    }
}