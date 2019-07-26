import React, { Component } from 'react';
import { Modal, Form, Button, Table, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';

export default class AddElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classRoom_id: "101",
            capacity: "20",
            description: "nuevo salon",
            faculty: 1,
            classroom: -1,
            schedule: -1,
            classrooms: [],
            schedules: []
        };
        this.addElective = this.addElective.bind(this);
        this.loadClassrooms = this.loadClassrooms.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.createListClassrooms = this.createListClassrooms.bind(this);
        this.createListSchedules = this.createListSchedules.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
        if (name === "classroom") {
            this.loadSchedules();
        }
    }

    //REQUESTS SERVER
    addElective(event) {
        const { classRoom_id, capacity, description, faculty } = this.state;
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
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadClassrooms() {
        axios.get("http://localhost:8000/api/classroom/")
            .then(response =>
                this.setState({ classrooms: response.data }))
    }

    loadSchedules() {
        if (parseInt(this.state.classroom) !== -1) {
            axios.post("http://localhost:8000/api/avaliable/" + this.state.classroom)
                .then(response =>
                    this.setState({ faculties: response.data }))
        }
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListClassrooms() {
        const listItems = this.state.classrooms.map((classroom) =>
            <option key={classroom.id} value={classroom.id}>{classroom.classroom_id} | {classroom.faculty__name}</option>
        );
        return listItems;
    }

    createListSchedules() {
        const listItems = this.state.schedules.map((schedule) =>
            <ListGroup.Item
                className="text-s1"
                key={schedule.time_from + "" + schedule.time_to + "" + schedule.day}>
                {schedule.day + ": " + schedule.time_from + " - " + schedule.time_to}
                <Button name="schedule" value={schedule.time_from + "|" + schedule.time_to + "|" + schedule.day} onClick={this.removeSchedule} className="mouse float-right text-sm p-0">x</Button>
            </ListGroup.Item>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadClassrooms();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar electiva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form onSubmit={this.addElective}>
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
                                        <Form.Control className="ml-0" as="select">
                                            <option key={-1} value={-1}>-----</option>
                                            <option key={1} value={1}>Alta</option>
                                            <option key={2} value={2}>Media</option>
                                            <option key={3} value={3}>Baja</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="bb-1-g mb-3">
                                <Col className="col-sm-4">
                                    <Row>
                                        <Col className="col-sm-12">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Salón</span></Form.Label>
                                                <Form.Control className="ml-0" as="select" name="classroom" value={this.state.classroom} onChange={this.handleChange}>
                                                    <option key={-1} value={-1}>-----</option>
                                                    <this.createListClassrooms />
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-sm-12">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Disponibilidad</span></Form.Label>
                                                <Form.Control className="ml-0" as="select" name="schedule" value={this.state.schedule} onChange={this.handleChange}>
                                                    <option key={-1} value={-1}>-----</option>
                                                    <this.createListSchedules />
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cerrar
						</Button>
                </Modal.Footer>
            </>
        );
    }
}