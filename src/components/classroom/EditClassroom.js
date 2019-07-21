import React, { Component } from 'react';
import { Form, Modal, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';
import { time, agregarHorario } from '../../js/index';

export default class EditClassroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classroom: props.salon,
            codigo: '101',
            capacity: "20",
            description: "nuevo salon",
            faculty: 1,
            faculties: [],
            schedules: [],
            show: false
        };
        this.loadClassroom = this.loadClassroom.bind(this);
        this.editClassroom = this.editClassroom.bind(this);
        this.createListFaculties = this.createListFaculties.bind(this);
        this.loadFaculties = this.loadFaculties.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
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
    }

    handleClose() {
        this.props.handleClose();
    }

    async editClassroom(event) {
        event.preventDefault();
        const { classroom, codigo, capacity, description, faculty } = this.state;
        var json = {
            "id": classroom,
            "classroom_id": codigo,
            "capacity": capacity,
            "description": description,
            "faculty": faculty
        }
        await axios.post('http://localhost:8000/api/classroom/', json)
            .then(response => {
                console.log(response);
                this.handleClose();
            })
            .catch(error => {
                if (error.response.status) {
                    time();
                    this.setState({ show: true });
                }
            });
    }

    async loadFaculties() {
        await axios.post('http://localhost:8000/api/faculty/')
            .then(response =>
                this.setState({ faculties: response.data }))
    }

    createListFaculties() {
        const listItems = this.state.faculties.map((faculty) =>
            <option key={faculty.pk} value={faculty.pk}>{faculty.fields.name}</option>
        );
        return listItems;
    }

    componentWillMount() {
        console.log('salon: ' + this.state.classroom);
        this.loadFaculties();
        this.setState({ showAlert: false });
        axios.get('http://localhost:8000/api/getclassroom/' + this.state.classroom)
            .then((response) => {
                this.loadClassroom(response.data[0])
            })
        axios.get('http://localhost:8000/api/schedule/' + this.state.classroom)
            .then((response) => {
                this.loadSchedules(response.data)
            })
    }

    loadSchedules(data) {
        // this.setState({codigo: data.fields.classroom_id, faculty: data.fields.faculty, capacity: data.fields.capacity, description: data.fields.description})
        var i;
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var inicio = this.getHora(data[i].schedule__time_from);
            var fin = this.getHora(data[i].schedule__time_to);
            var dia = this.getDia(data[i].schedule__day);
            if (agregarHorario(inicio, fin, dia)) {
                this.state.schedules.push({ "time_from": inicio, "time_to": fin, "day": dia, "schedule": data[i].schedule });
            }
        }
        console.log(this.state.schedules);
    }

    loadClassroom(data) {
        this.setState({ codigo: data.fields.classroom_id, faculty: data.fields.faculty, capacity: data.fields.capacity, description: data.fields.description })
    }

    getHora(hora) {
        switch (hora) {
            case '07:00:00':
                return 1;
            case '09:00:00':
                return 2;
            case '11:00:00':
                return 3;
            case '13:00:00':
                return 4;
            case '14:00:00':
                return 5;
            case '16:00:00':
                return 6;
            case '18:00:00':
                return 7;
            case '20:00:00':
                return 8;
            case '21:00:00':
                return 9;
            default:
                break;
        }
    }

    getDia(dia) {
        switch (dia) {
            case 'lunes':
                return 1;
            case 'martes':
                return 2;
            case 'miercoles':
                return 3;
            case 'jueves':
                return 4;
            case 'viernes':
                return 5;
            case 'sabado':
                return 6;
            default:
                break;
        }
    }

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Editar salón</Modal.Title>
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
                                        <Form.Control className="ml-0" type="number" name="capacity" value={this.state.capacity} onChange={this.handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-6 col-xl-4">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Facultad</span></Form.Label>
                                        <Form.Control className="ml-0" as="select" name="faculty" value={this.state.faculty} onChange={this.handleChange}>
                                            <this.createListFaculties />
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
                                        <tbody className="table-sm body-horario">
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
                                                <td></td>
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
                                                <td></td>
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
                    <div className="no-login time">
                        <Alert variant="danger" show={this.state.show} onClose={handleDismiss} dismissible>
                            <p>El salón ya existe</p>
                        </Alert>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.editClassroom}>Guardar cambios</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>

            </>
        );
    }
}