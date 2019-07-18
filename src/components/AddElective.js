import React, { Component } from 'react';
import { Form, Button, Table, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import '../css/Table.css';

export default class AddElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classRoom_id: "101",
            capacity: "20",
            description: "nuevo salon",
            faculty: 1
        };
        this.newClassroom = this.newClassroom.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: [event.target.value] })
    }

    newClassroom(event) {
        const { classRoom_id, capacity, description, faculty } = this.state;
        console.log("Holaaaaaa");
        console.log("capacidad" + capacity);
        var json = {
            "classroom_id": classRoom_id,
            "capacity": capacity,
            "description": description,
            "faculty": faculty
        }
        event.preventDefault();

        axios.post('http://localhost:8000/api/classroom/', json)
            .then(function (respone) {
                console.log(respone);
            });
    }

    render() {
        return (
            /* TODO: Falta arreglar el espacio que deja vacio */
            <div className="container-fluid">
                <Form onSubmit={this.newClassroom}>
                    <Row className="bb-1-g mb-3">
                        <Col className="col-sm-3 col-xl-2 col-lg-2">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Código</span></Form.Label>
                                <Form.Control className="ml-0" type="text" name="classRoom_id" value={this.state.classRoom_id} onChange={this.handleChange} />
                            </Form.Group>
                        </Col>
                        <Col className="col-sm-3 col-xl-2 col-lg-2">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Nombre</span></Form.Label>
                                <Form.Control className="ml-0" type="text" name="capacity" value={this.state.capacity} onChange={this.handleChange} />
                            </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-2 col-lg-2">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Cupos</span></Form.Label>
                                <Form.Control className="ml-0" type="number"></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-2 col-lg-2">
                            <Form.Group>
                                <Form.Label><span className="ml-0">Prioridad</span></Form.Label>
                                <Form.Control className="ml-0" type="number"></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="bb-1-g mb-3">
                        <Col className="col-sm-4">
                            <Row>
                                <Col className="col-sm-12">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Salón</span></Form.Label>
                                        <Form.Control className="ml-0" as="select">
                                            <option>105 | IPET</option>
                                            <option>109 | FIET</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-12">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Disponibilidad</span></Form.Label>
                                        <Form.Control className="ml-0" as="select">
                                            <option>Lunes  | 07:00 - 09:00</option>
                                            <option>Martes | 14:00 - 16:00</option>
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
                                <textarea className="form-control" name="" id=""></textarea>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button className="rounded-10" variant="primary" type="submit">Registrar</Button>
                </Form>
            </div>
        );
    }
}