import React, { Component } from 'react';
import { Form, Modal, Button, Table, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import '../css/Table.css';

export default class AddClassroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            codigo: '101',
            capacity: "20",
            description: "nuevo salon",
            faculty: 1
        };
        this.addClassroom = this.addClassroom.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        console.log(this.state);
    }

    handleClose() {
        this.props.handleClose();
    }

    addClassroom(event) {
        event.preventDefault();
        const { codigo, capacity, description, faculty } = this.state;
        var json = {
            "classroom_id": codigo,
            "capacity": capacity,
            "description": description,
            "faculty": faculty
        }
        axios.put('http://localhost:8000/api/classroom/', json)
            .then(function (response) {
                console.log(response);
            });
        this.handleClose();
    }

    componentWillMount() {
        console.log(this.state);
    }

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar salón</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form>
                            <Row className="bb-1-g mb-3">
                                <Col className="col-sm-3 col-xl-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">No. Salón</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="codigo" value={this.state.codigo} onChange={this.handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-3 col-xl-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Capacidad</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="capacity" value={this.state.capacity} onChange={this.handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-6 col-xl-4">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Facultad</span></Form.Label>
                                        <Form.Control className="ml-0" as="select">
                                            <option>FIET</option>
                                            <option>PIET</option>
                                            <option>Contables</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="bb-1-g mb-3">
                                <Col className="col-sm-4">
                                    <Row>
                                        <Col className="col-sm-12">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Día</span></Form.Label>
                                                <Form.Control className="ml-0" as="select">
                                                    <option>Lunes</option>
                                                    <option>Martes</option>
                                                    <option>Miércoles</option>
                                                    <option>Jueves</option>
                                                    <option>Viernes</option>
                                                    <option>Sábado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-sm-6">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Inicio</span></Form.Label>
                                                <Form.Control className="ml-0" as="select">
                                                    <option>07:00</option>
                                                    <option>09:00</option>
                                                    <option>11:00</option>
                                                    <option>13:00</option>
                                                    <option>14:00</option>
                                                    <option>16:00</option>
                                                    <option>18:00</option>
                                                    <option>20:00</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-sm-6">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Fin</span></Form.Label>
                                                <Form.Control className="ml-0" as="select">
                                                    <option>07:00</option>
                                                    <option>09:00</option>
                                                    <option>11:00</option>
                                                    <option>13:00</option>
                                                    <option>14:00</option>
                                                    <option>16:00</option>
                                                    <option>18:00</option>
                                                    <option>20:00</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="col-sm-12">
                                            <Button className="rounded-10  w-100" variant="primary" type="submit">Agregar Horario</Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="col-sm-8">
                                    <Table responsive size="s">
                                        <thead className="table-sm">
                                            <tr>
                                                <th>Hora</th>
                                                <th>Lunes</th>
                                                <th>Martes</th>
                                                <th>Miércoles</th>
                                                <th>Jueves</th>
                                                <th>Viernes</th>
                                                <th>Sábado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-sm">
                                            <tr>
                                                <td>07:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>09:00</td>
                                                <td className="ocupado"></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>11:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>13:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>14:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>16:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="ocupado"></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>18:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>20:00</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Description</span></Form.Label>
                                        <textarea className="form-control" name="description" id="" value={this.state.description} onChange={this.handleChange}></textarea>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.addClassroom}>Registrar</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>
            </>
        );
    }
}