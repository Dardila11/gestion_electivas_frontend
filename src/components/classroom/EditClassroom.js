import React, { Component } from 'react';
import { Form, Modal, Button, Table, Alert, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';
import { time, addSchedule, removeSchedule } from '../../js/HandleDOM';
import { hashHour, hashDay, unhashHour, unhashDay, findSchedule } from '../../js/HandleSchedule';

export default class updateClassroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classroom: props.classroom,
            classroom_id: '',
            capacity: '',
            description: '',
            faculty: -1,
            time_from: 1,
            time_to: 1,
            day: 1,
            faculties: [],
            schedules: [],
            schedules_add: [],
            schedules_delete: [],
            message: '',
            show: false
        };
        this.updateClassroom = this.updateClassroom.bind(this);
        this.loadClassroom = this.loadClassroom.bind(this);
        this.loadFaculties = this.loadFaculties.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.createListFaculties = this.createListFaculties.bind(this);
        this.createListSchedule = this.createListSchedule.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleCloseUpdate = () => {
        this.props.handleCloseUpdate();
    }

    addSchedule = () => {
        var isExists = findSchedule(this.state.schedules, this.state.time_from, this.state.time_to, this.state.day);
        if (isExists) {
            if (addSchedule(this.state.time_from, this.state.time_to, this.state.day)) {
                var time_from = hashHour(this.state.time_from);
                var time_to = hashHour(this.state.time_to);
                var day = hashDay(this.state.day);
                this.state.schedules.push({ 'time_from': time_from, 'time_to': time_to, 'day': day });
                this.state.schedules_add.push({ 'time_from': time_from, 'time_to': time_to, 'day': day });
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
            var inicio = event.target.value.split('|')[0];
            var fin = event.target.value.split('|')[1];
            var dia = event.target.value.split('|')[2];
            var is_history = false;
            if (inicio === schedule.time_from && fin === schedule.time_to && dia === schedule.day) {
                var j = 0, schedule_add;
                for (schedule_add of this.state.schedules_add) {
                    if (schedule.time_from === schedule_add.time_from && schedule.time_to === schedule_add.time_to && schedule.day === schedule_add.day) {
                        this.state.schedules_add.splice(j, 1);
                        is_history = true;
                        break;
                    }
                    j++;
                }
                if (!is_history)
                    this.state.schedules_delete.push(this.state.schedules[i]);
                this.state.schedules.splice(i, 1);
                removeSchedule(unhashHour(inicio), unhashHour(fin), unhashDay(dia));
                break;
            }
            i++;
        }
        this.setState({ schedules: this.state.schedules });
    }

    //REQUESTS SERVER
    async updateClassroom(event) {
        event.preventDefault();
        var okClassroom = false, okSchedules = false;
        if (parseInt(this.state.faculty) !== -1) {
            //CREATE CLASSROOM
            const { classroom, classroom_id, capacity, description, faculty } = this.state;
            var json = {
                'id': classroom,
                'classroom_id': classroom_id,
                'capacity': capacity,
                'description': description,
                'faculty': faculty
            }
            await axios.post('http://localhost:8000/api/classroom/', json)
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
            //UPDATE SCHEDULES TO CLASSROOM
            const { schedules_add, schedules_delete } = this.state;
            json = {
                'id': classroom,
                'schedules_add': schedules_add,
                'schedules_delete': schedules_delete
            }
            await axios.post('http://localhost:8000/api/schedule/', json)
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
                this.handleCloseUpdate();
            }
        } else {
            time();
            this.setState({ message: 'Seleccione una facultad', show: true });
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadFaculties() {
        axios.post('http://localhost:8000/api/faculty/')
            .then(response =>
                this.setState({ faculties: response.data }))
    }

    loadSchedules(data) {
        var i;
        for (i = 0; i < data.length; i++) {
            var inicio = data[i].schedule__time_from;
            var fin = data[i].schedule__time_to;
            var dia = data[i].schedule__day;
            if (addSchedule(unhashHour(inicio), unhashHour(fin), unhashDay(dia))) {
                this.state.schedules.push({ 'time_from': inicio, 'time_to': fin, 'day': dia, 'schedule': data[i].schedule });
            }
        }
        this.setState({ schedules: this.state.schedules })
    }

    loadClassroom(data) {
        this.setState({ classroom_id: data.fields.classroom_id, faculty: data.fields.faculty, capacity: data.fields.capacity, description: data.fields.description })
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
        this.setState({ showAlert: false });
        axios.get('http://localhost:8000/api/getclassroom/' + this.state.classroom)
            .then((response) => {
                this.loadClassroom(response.data[0])
            })
        axios.get('http://localhost:8000/api/schedule/' + this.state.classroom)
            .then((response) => {
                //this.setState({schedules: response.data})
                this.loadSchedules(response.data)
            })
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Editar salón</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='container-fluid'>
                        <Form id='formulario' onSubmit={this.updateClassroom}>
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
                                                <Form.Control className='ml-0' name='time_to' value={this.state.time_to} onChange={this.handleChange} as='select'>
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
                    <div className='no-login time'>
                        <Alert variant='danger' show={this.state.show} onClose={handleDismiss} dismissible>
                            <p className='mb-0'>{this.state.message}</p>
                        </Alert>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' type='submit' form='formulario'>Guardar cambios</Button>
                    <Button variant='secondary' onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>

            </>
        );
    }
}