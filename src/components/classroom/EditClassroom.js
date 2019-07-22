import React, { Component } from 'react';
import { Form, Modal, Button, Table, Alert, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

import '../../css/Table.css';
import { time, agregarHorario, eliminarHorario } from '../../js/index';

export default class EditClassroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classroom: props.salon,
            codigo: '',
            capacity: "",
            description: "",
            faculty: 1,
            inicio: 1,
            fin: 1,
            dia: 1,
            faculties: [],
            schedules: [],
            schedules_add: [],
            schedules_delete: [],
            show: false
        };
        this.agregarHorario = this.agregarHorario.bind(this);
        this.eliminarHorario = this.eliminarHorario.bind(this);
        this.loadClassroom = this.loadClassroom.bind(this);
        this.createLisSchedule = this.createLisSchedule.bind(this);
        this.editClassroom = this.editClassroom.bind(this);
        this.createListFaculties = this.createListFaculties.bind(this);
        this.loadFaculties = this.loadFaculties.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    agregarHorario() {
        var agregar = true;
        var schedule;
        for (schedule of this.state.schedules) {
            var hora_from = moment(this.getHora(schedule.time_from), 'HH:mm:ss').hour();
            var hora_to = moment(this.getHora(schedule.time_to), 'HH:mm:ss').hour();
            var hora_inicio = moment(this.state.inicio, 'HH:mm:ss').hour();
            var hora_fin = moment(this.state.fin, 'HH:mm:ss').hour();
            var start = hora_inicio >= hora_from && hora_inicio < hora_to;
            var end = hora_fin > hora_from && hora_fin <= hora_to;
            // console.log(schedule.day + ' ' +  this.getDia1(this.state.dia));
            // console.log(start + ' ' + hora_inicio + '>=' + hora_from + '&&' + hora_inicio + '<' + hora_to);
            if ((start || end) && schedule.day === this.getDia1(this.state.dia)) {
                agregar = false;
                break;
            }
        }
        if (agregar) {
            if (agregarHorario(this.state.inicio, this.state.fin, this.state.dia) && agregar) {
                var inicio = this.getHora1(this.state.inicio);
                var fin = this.getHora1(this.state.fin);
                var dia = this.getDia1(this.state.dia);
                this.state.schedules.push({ "time_from": inicio, "time_to": fin, "day": dia });
                this.state.schedules_add.push({ "time_from": inicio, "time_to": fin, "day": dia });
                this.setState({ schedules: this.state.schedules })
            }
        } else {
            time();
            this.setState({ message: "horario incluido en otro", show: true });
        }
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
        const { schedules_add, schedules_delete } = this.state;
        var json = {
            "id": classroom, 
            "schedules_add": schedules_add,
            "schedules_delete": schedules_delete
        }
        await axios.post('http://localhost:8000/api/schedule/', json)
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

    loadSchedules(data) {
        // this.setState({codigo: data.fields.classroom_id, faculty: data.fields.faculty, capacity: data.fields.capacity, description: data.fields.description})
        var i;
        for (i = 0; i < data.length; i++) {
            var inicio = data[i].schedule__time_from;
            var fin = data[i].schedule__time_to;
            var dia = data[i].schedule__day;
            if (agregarHorario(this.getHora(inicio), this.getHora(fin), this.getDia(dia))) {
                this.state.schedules.push({ "time_from": inicio, "time_to": fin, "day": dia, "schedule": data[i].schedule });
            }
        }
        this.setState({schedules: this.state.schedules})
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

    getHora1(hora) {
        switch (hora) {
            case 1: case '1':
                return "07:00:00";
            case 2: case '2':
                return "09:00:00";
            case 3: case '3':
                return "11:00:00";
            case 4: case '4':
                return "13:00:00";
            case 5: case '5':
                return "14:00:00";
            case 6: case '6':
                return "16:00:00";
            case 7: case '7':
                return "18:00:00";
            case 8: case '8':
                return "20:00:00";
            case 9: case '9':
                return "21:00:00";
            default:
                break;
        }
    }

    getDia1(dia) {
        switch (dia) {
            case 1: case '1':
                return "lunes";
            case 2: case '2':
                return "martes";
            case 3: case '3':
                return "miercoles";
            case 4: case '4':
                return "jueves";
            case 5: case '5':
                return "viernes";
            case 6: case '6':
                return "sabado";
            default:
                break;
        }
    }

    createLisSchedule() {
        const listItems = this.state.schedules.map((schedule) =>
            <ListGroup.Item
                className="text-s1"
                key={schedule.time_from + '' + schedule.time_to + '' + schedule.day}>
                {schedule.day + ': ' + schedule.time_from + ' - ' + schedule.time_to}
                <Button name="schedule" value={schedule.time_from + '|' + schedule.time_to + '|' + schedule.day} onClick={this.eliminarHorario} className="mouse float-right text-sm p-0">x</Button>
            </ListGroup.Item>
        );
        return listItems;
    }

    eliminarHorario(event) {
        var schedule;
        var i = 0;
        for (schedule of this.state.schedules) {
            var inicio = event.target.value.split('|')[0];
            var fin = event.target.value.split('|')[1];
            var dia = event.target.value.split('|')[2];
            console.log(inicio + '|' + schedule.time_from);
            var is_history = false;
            if (inicio === schedule.time_from && fin === schedule.time_to && dia === schedule.day) {
                var j = 0, schedule_add;
                for (schedule_add of this.state.schedules_add) {
                    console.log(schedule.time_from + '|' + schedule_add.time_from)
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
                eliminarHorario(this.getHora(inicio), this.getHora(fin), this.getDia(dia));
                break;
            }
            i++;
        }
        console.log(this.state.schedules_add)
        console.log(this.state.schedules_delete)
        this.setState({ schedules: this.state.schedules });
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
                                                <Form.Control className="ml-0" as="select" name="dia" value={this.state.dia} onChange={this.handleChange}>
                                                    <option value='1'>Lunes</option>
                                                    <option value='2'>Martes</option>
                                                    <option value='3'>Miércoles</option>
                                                    <option value='4'>Jueves</option>
                                                    <option value='5'>Viernes</option>
                                                    <option value='6'>Sábado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-sm-6">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Inicio</span></Form.Label>
                                                <Form.Control className="ml-0" as="select" name="inicio" value={this.state.inicio} onChange={this.handleChange}>
                                                    <option value="1">07:00</option>
                                                    <option value="2">09:00</option>
                                                    <option value="3">11:00</option>
                                                    <option value="4">13:00</option>
                                                    <option value="5">14:00</option>
                                                    <option value="6">16:00</option>
                                                    <option value="7">18:00</option>
                                                    <option value="8">20:00</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-sm-6">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Fin</span></Form.Label>
                                                <Form.Control className="ml-0" name="fin" value={this.state.fin} onChange={this.handleChange} as="select">
                                                    <option value="1">07:00</option>
                                                    <option value="2">09:00</option>
                                                    <option value="3">11:00</option>
                                                    <option value="4">13:00</option>
                                                    <option value="5">14:00</option>
                                                    <option value="6">16:00</option>
                                                    <option value="7">18:00</option>
                                                    <option value="8">20:00</option>
                                                    <option value="9">21:00</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="col-sm-12">
                                            <Button className="rounded-10  w-100" variant="primary" onClick={this.agregarHorario}>Agregar Horario</Button>
                                        </Col>
                                    </Row>
                                    <Row className="pt-2 pb-2">
                                        <Col>
                                            <ListGroup className="w-l over-y">
                                                <this.createLisSchedule />
                                            </ListGroup>
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