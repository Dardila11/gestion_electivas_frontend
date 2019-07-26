import React, { Component } from 'react';
import { Form, Modal, Button, Table, Alert, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';
import { time, addSchedule, removeSchedule } from '../../js/HandleDOM';
import { hashHour, hashDay, unhashHour, unhashDay, findSchedule } from '../../js/HandleSchedule';

export default class AddClassroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classroom_id: '',
            capacity: '',
            description: '',
            faculty: -1,
            time_from: 1,
            time_to: 1,
            day: 1,
            faculties: [],
            schedules: [],
            message: '',
            show: false
        };
        this.addClassroom = this.addClassroom.bind(this);
        this.loadFaculties = this.loadFaculties.bind(this);
        this.createListFaculties = this.createListFaculties.bind(this);
        this.createListSchedule = this.createListSchedule.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleCloseCreate = () => {
        this.props.handleCloseCreate();
    }

    addSchedule = () => {
        var isExists = findSchedule(this.state.schedules, this.state.time_from, this.state.time_to, this.state.day);
        if (isExists) {
            if (addSchedule(this.state.time_from, this.state.time_to, this.state.day)) {
                var time_from = hashHour(this.state.time_from);
                var time_to = hashHour(this.state.time_to);
                var day = hashDay(this.state.day);
                this.state.schedules.push({ 'time_from': time_from, 'time_to': time_to, 'day': day });
                this.setState({ schedules: this.state.schedules })
            } else {
                time();
                this.setState({ message: 'La hora de fin debe ser mayor a la hora de inicio', show: true });
            }
        } else {
            time();
            this.setState({ message: 'El horario esta incluido en otra franja', show: true });
        }
    }

    removeSchedule = (event) => {
        var schedule;
        var i = 0;
        for (schedule of this.state.schedules) {
            var time_from = event.target.value.split('|')[0];
            var time_to = event.target.value.split('|')[1];
            var day = event.target.value.split('|')[2];
            if (time_from === schedule.time_from && time_to === schedule.time_to && day === schedule.day) {
                this.state.schedules.splice(i, 1);
                removeSchedule(unhashHour(time_from), unhashHour(time_to), unhashDay(day));
                break;
            }
            i++;
        }
        this.setState({ schedules: this.state.schedules });
    }

    //REQUESTS SERVER
    async addClassroom(event) {
        event.preventDefault();
        var okClassroom = false, okSchedules = false;
        if (parseInt(this.state.faculty) !== -1) {
            //CREATE CLASSROOM
            const { classroom_id, capacity, description, faculty } = this.state;
            var json = {
                'classroom_id': classroom_id,
                'capacity': capacity,
                'description': description,
                'faculty': faculty
            }
            await axios.put('http://localhost:8000/api/classroom/', json)
                .then(() => {
                    okClassroom = true;
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status) {
                        time();
                        this.setState({ message: 'El salón ya existe', show: true });
                    }
                });
            //CREATE SCHEDULES TO CLASSROOM
            const { schedules } = this.state;
            json = {
                'classroom': classroom_id,
                'schedules': schedules
            }
            await axios.put('http://localhost:8000/api/schedule/', json)
                .then(() => {
                    okSchedules = true;
                })
                .catch(error => {
                    if (error.response.status) {
                        time();
                        this.setState({ message: 'Alguno de los horarios ya existe', show: true });
                    }
                });
            if (okClassroom && okSchedules) {
                this.handleCloseCreate();
            }
        } else {
            time();
            this.setState({ message: 'Seleccione una facultad', show: true });
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    //TODO Update faculty for first position in array request server
    loadFaculties() {
        axios.post('http://localhost:8000/api/faculty/')
            .then(response =>
                this.setState({ faculties: response.data }))
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListFaculties() {
        const listItems = this.state.faculties.map((faculty) =>
            <option key={faculty.pk} value={faculty.pk}>{faculty.fields.name}</option>
        );
        return listItems;
    }

    createListSchedule() {
        const listItems = this.state.schedules.map((schedule) =>
            <ListGroup.Item
                className='text-s1'
                key={schedule.time_from + '' + schedule.time_to + '' + schedule.day}>
                {schedule.day + ': ' + schedule.time_from + ' - ' + schedule.time_to}
                <Button name='schedule' value={schedule.time_from + '|' + schedule.time_to + '|' + schedule.day} onClick={this.removeSchedule} className='mouse float-right text-sm p-0'>x</Button>
            </ListGroup.Item>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadFaculties();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar salón</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='container-fluid'>
                        <Form id='formulario' onSubmit={this.addClassroom}>
                            <Row className='bb-1-g mb-3'>
                                <Col className='col-sm-3 col-xl-2'>
                                    <Form.Group>
                                        <Form.Label><span className='ml-0'>No. Salón</span></Form.Label>
                                        <Form.Control className='ml-0' type='text' name='classroom_id' value={this.state.classroom_id} onChange={this.handleChange} placeholder="No. salón" required />
                                    </Form.Group>
                                </Col>
                                <Col className='col-sm-3 col-xl-2'>
                                    <Form.Group>
                                        <Form.Label><span className='ml-0'>Capacidad</span></Form.Label>
                                        <Form.Control className='ml-0' type='number' name='capacity' value={this.state.capacity} onChange={this.handleChange} placeholder="Capacidad" required />
                                    </Form.Group>
                                </Col>
                                <Col className='col-sm-6 col-xl-4'>
                                    <Form.Group>
                                        <Form.Label><span className='ml-0'>Facultad</span></Form.Label>
                                        <Form.Control className='ml-0' as='select' name='faculty' value={this.state.faculty} onChange={this.handleChange}>
                                            <option key={-1} value={-1}>-----</option>
                                            <this.createListFaculties />
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='bb-1-g mb-3'>
                                <Col className='col-sm-4'>
                                    <Row>
                                        <Col className='col-sm-12'>
                                            <Form.Group>
                                                <Form.Label><span className='ml-0'>Día</span></Form.Label>
                                                <Form.Control className='ml-0' as='select' name='day' value={this.state.day} onChange={this.handleChange}>
                                                    <option value='1'>Lunes</option>
                                                    <option value='2'>Martes</option>
                                                    <option value='3'>Miércoles</option>
                                                    <option value='4'>Jueves</option>
                                                    <option value='5'>Viernes</option>
                                                    <option value='6'>Sábado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-sm-6'>
                                            <Form.Group>
                                                <Form.Label><span className='ml-0'>Inicio</span></Form.Label>
                                                <Form.Control className='ml-0' as='select' name='time_from' value={this.state.time_from} onChange={this.handleChange}>
                                                    <option value='1'>07:00</option>
                                                    <option value='2'>09:00</option>
                                                    <option value='3'>11:00</option>
                                                    <option value='5'>14:00</option>
                                                    <option value='6'>16:00</option>
                                                    <option value='7'>18:00</option>
                                                    <option value='8'>20:00</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-sm-6'>
                                            <Form.Group>
                                                <Form.Label><span className='ml-0'>Fin</span></Form.Label>
                                                <Form.Control className='ml-0' as='select' name='time_to' value={this.state.time_to} onChange={this.handleChange}>
                                                    <option value='1'>07:00</option>
                                                    <option value='2'>09:00</option>
                                                    <option value='3'>11:00</option>
                                                    <option value='4'>13:00</option>
                                                    <option value='5'>14:00</option>
                                                    <option value='6'>16:00</option>
                                                    <option value='7'>18:00</option>
                                                    <option value='8'>20:00</option>
                                                    <option value='9'>21:00</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='col-sm-12'>
                                            <Button className='rounded-10  w-100' variant='primary' onClick={this.addSchedule}>Agregar Horario</Button>
                                        </Col>
                                    </Row>
                                    <Row className='pt-2 pb-2'>
                                        <Col>
                                            <ListGroup className='w-l over-y'>
                                                <this.createListSchedule />
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='col-sm-8'>
                                    <Table responsive size='s'>
                                        <thead className='table-sm'>
                                            <tr className='th-s'>
                                                <th>Hora</th>
                                                <th>Lunes</th>
                                                <th>Martes</th>
                                                <th>Miércoles</th>
                                                <th>Jueves</th>
                                                <th>Viernes</th>
                                                <th>Sábado</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-sm body-horario'>
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
                                        <Form.Label><span className='ml-0'>Descripción</span></Form.Label>
                                        <textarea className='form-control' name='description' id='' value={this.state.description} onChange={this.handleChange} required></textarea>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' type='submit' form='formulario'>Registrar</Button>
                    <Button variant='secondary' onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>
                <div className='no-login time'>
                    <Alert variant='danger' show={this.state.show} onClose={handleDismiss} dismissible>
                        <p className='mb-0'>{this.state.message}</p>
                    </Alert>
                </div>
            </>
        );
    }
}