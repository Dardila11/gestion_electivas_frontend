import React, { Component } from "react";
import { Modal, Form, Button, Table, Alert, Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

import "../../css/Table.css";
import { time, addSchedule, removeSchedule } from "../../js/HandleDOM";
import { hashHour, hashDay, unhashHour, unhashDay, findSchedule } from "../../js/HandleSchedule";
registerLocale("es", es);

export default class AddElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            elective_id: "",
            quota: "",
            faculty: 1,
            priority: -1,
            classroom: -1,
            schedule: -1,
            professor: -1,
            avaliable_hour: -1,
            time_from: 1,
            time_to: 1,
            day: 1,
            voteDateFrom: new Date(),
            voteDateTo: new Date(),
            voteTimeFrom: new Date(),
            voteTimeTo: new Date(),
            classrooms: [],
            schedules: [],
            avaliable_hours: [],
            professors: [],
            show: false,
            message: ""
        };
        this.addElective = this.addElective.bind(this);
        this.loadClassrooms = this.loadClassrooms.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.loadProfessors = this.loadProfessors.bind(this);
        this.createListClassrooms = this.createListClassrooms.bind(this);
        this.createListSchedules = this.createListSchedules.bind(this);
        this.createListAvaliableHours = this.createListAvaliableHours.bind(this);
        this.createListProfessors = this.createListProfessors.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
        if (name === "classroom") {
            this.loadSchedules(value);
        }
        if (name === "schedule") {
            axios.post("http://localhost:8000/api/avaliable/get/" + value)
                .then((response) => {
                    this.setState({ avaliable_hour: response.data[0].id, time_from: response.data[0].schedule__time_from, time_to: response.data[0].schedule__time_to, day: response.data[0].schedule__day })
                })
        }
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleCloseCreate = () => {
        this.props.handleCloseCreate();
    }

    handleChangeVoteDateFrom = (date) => {
        this.setState({ voteDateFrom: date });
    }

    handleChangeVoteDateTo = (date) => {
        this.setState({ voteDateTo: date });
    }

    handleChangeVoteTimeFrom = (time) => {
        this.setState({ voteTimeFrom: time });
    }

    handleChangeVoteTimeTo = (time) => {
        this.setState({ voteTimeTo: time });
    }

    addSchedule = () => {        
        var isExists = findSchedule(this.state.avaliable_hours, unhashHour(this.state.time_from), unhashDay(this.state.time_to), unhashDay(this.state.day));
        if (parseInt(this.state.avaliable_hour) !== -1) {
            if (isExists) {
                if (addSchedule(unhashHour(this.state.time_from), unhashHour(this.state.time_to), unhashDay(this.state.day), "schedule-elective")) {
                    var time_from = this.state.time_from;
                    var time_to = this.state.time_to;
                    var day = this.state.day;
                    this.state.avaliable_hours.push({ "id": this.state.avaliable_hour, "time_from": time_from, "time_to": time_to, "day": day });
                    this.setState({ avaliable_hours: this.state.avaliable_hours })
                } else {
                    time();
                    this.setState({ message: "La hora de fin debe ser mayor a la hora de inicio", show: true });
                }
            } else {
                time();
                this.setState({ message: "El horario esta incluido en otra franja", show: true });
            }
        } else {
            time();
            this.setState({ message: "Elija una fraja horaria", show: true });
        }
    }

    removeSchedule = (event) => {
        var schedule;
        var i = 0;
        for (schedule of this.state.avaliable_hours) {
            if (parseInt(event.target.value) === schedule.id) {
                const time_from = schedule.time_from;
                const time_to = schedule.time_to;
                const day = schedule.day;
                this.state.avaliable_hours.splice(i, 1);
                removeSchedule(unhashHour(time_from), unhashHour(time_to), unhashDay(day), "schedule-elective");
                break;
            }
            i++;
        }
        this.setState({ avaliable_hours: this.state.avaliable_hours });
    }

    //REQUESTS SERVER
    addElective(event) {
        //TODO Registrar horarios
        event.preventDefault();
        var okCourse = false;
        const semester = parseInt(localStorage.getItem("semester"));
        if (parseInt(this.state.priority) !== -1 || parseInt(this.state.professor) !== -1) {
            const { elective_id, quota, priority, professor, voteDateFrom, voteDateTo, voteTimeFrom, voteTimeTo } = this.state;
            const from_date_vote = voteDateFrom.getFullYear() + "-" + voteDateFrom.getMonth() + "-" + voteDateFrom.getDate() + "T" + voteTimeFrom.getHours() + ":" + voteTimeFrom.getMinutes() + ":" + voteTimeFrom.getSeconds();
            const until_date_vote = voteDateTo.getFullYear() + "-" + voteDateTo.getMonth() + "-" + voteDateTo.getDate() + "T" + voteTimeTo.getHours() + ":" + voteTimeTo.getMinutes() + ":" + voteTimeTo.getSeconds();
            var json = {
                "quota": quota,
                "priority": priority,
                "from_date_vote": from_date_vote,
                "until_date_vote": until_date_vote,
                "course": elective_id,
                "professor": professor,
                "semester": semester,
            }
            axios.put("http://localhost:8000/api/course/", json)
                .then(function (respone) {
                    okCourse = true
                })
                .catch(() => {
                    time();
                    this.setState({ message: "El curso ya esta incluido ", show: true });
                })
        } else {
            time();
            this.setState({ message: "Elija una prioridad y profesor", show: true });
        }
        if (okCourse) {
            this.handleCloseCreate();
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadClassrooms() {
        axios.get("http://localhost:8000/api/classroom/")
            .then(response =>
                this.setState({ classrooms: response.data }))
    }

    loadSchedules(value) {
        axios.post("http://localhost:8000/api/avaliable/" + value)
            .then(response =>
                this.setState({ schedules: response.data }))
    }

    loadProfessors() {
        axios.get("http://localhost:8000/api/professor/")
            .then(response =>
                this.setState({ professors: response.data }))
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
            <option key={schedule.id} value={schedule.id}>{schedule.schedule__day} | {schedule.schedule__time_from} - {schedule.schedule__time_to}</option>
        );
        return listItems;
    }

    createListProfessors() {
        const listItems = this.state.professors.map((professor) =>
            <option key={professor.id} value={professor.id}>{professor.first_name} {professor.last_name}</option>
        );
        return listItems;
    }

    createListAvaliableHours() {
        const listItems = this.state.avaliable_hours.map((avaliable_hour) =>
            <ListGroup.Item
                className="text-s1"
                key={avaliable_hour.id}>
                {avaliable_hour.day + ": " + avaliable_hour.time_from + " - " + avaliable_hour.time_to}
                <Button name="schedule" value={avaliable_hour.id} onClick={this.removeSchedule} className="mouse float-right text-sm p-0">x</Button>
            </ListGroup.Item>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadClassrooms();
        this.loadProfessors();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar electiva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form id="formulario" onSubmit={this.addElective}>
                            <Row className="bb-1-g mb-3">
                                <Col className="col-sm-3 col-xl-2 col-lg-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Código</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="elective_id" value={this.state.elective_id} onChange={this.handleChange} placeholder="Código" required />
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-6 col-xl-2 col-lg-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Cupos</span></Form.Label>
                                        <Form.Control className="ml-0" type="number" name="quota" value={this.state.quota} onChange={this.handleChange} placeholder="Cupos" required></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-6 col-xl-3 col-lg-3">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Profesor</span></Form.Label>
                                        <Form.Control className="ml-0" as="select" name="professor" value={this.state.professor} onChange={this.handleChange}>
                                            <option key={-1} value={-1}>-----</option>
                                            <this.createListProfessors />
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-6 col-xl-2 col-lg-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Prioridad</span></Form.Label>
                                        <Form.Control className="ml-0" as="select" name="priority" value={this.state.priority} onChange={this.handleChange}>
                                            <option key={-1} value={-1}>-----</option>
                                            <option key={1} value={1}>Alta</option>
                                            <option key={2} value={2}>Media</option>
                                            <option key={3} value={3}>Baja</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-2 bb-1-g mb-3">
                                <Col>
                                    <Form.Label><span className="h5">Fechas de Votaciones</span></Form.Label>
                                    <Row>
                                        <Col className="col-lg-4">
                                            <Form.Group>
                                                <Form.Label><span >Inicio</span></Form.Label>
                                                <Form.Group>
                                                    <DatePicker className="form-control"
                                                        selected={this.state.voteDateFrom}
                                                        endDate={this.state.voteDateTo}
                                                        onChange={this.handleChangeVoteDateFrom}
                                                        placeholderText="Fecha Inicio"
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                    <DatePicker className="form-control"
                                                        selected={this.state.voteTimeFrom}
                                                        onChange={this.handleChangeVoteTimeFrom}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={30}
                                                        dateFormat="h:mm aa"
                                                        timeCaption="Time"
                                                    />
                                                </Form.Group>
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-lg-4">
                                            <Form.Group>
                                                <Form.Label><span >Final</span></Form.Label>
                                                <Form.Group>
                                                    <DatePicker className="form-control"
                                                        selected={this.state.voteDateTo}
                                                        startDate={this.state.voteDateFrom}
                                                        onChange={this.handleChangeVoteDateTo}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="Fecha Final"
                                                        minDate={this.state.voteDateFrom}
                                                    />
                                                    <DatePicker className="form-control"
                                                        selected={this.state.voteTimeTo}
                                                        onChange={this.handleChangeVoteTimeTo}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={30}
                                                        dateFormat="h:mm aa"
                                                        timeCaption="Time"
                                                    />
                                                </Form.Group>
                                            </Form.Group>
                                        </Col>
                                    </Row>
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
                                            <Button className="rounded-10  w-100" variant="primary" onClick={this.addSchedule}>Agregar Horario</Button>
                                        </Col>
                                    </Row>
                                    <Row className="pt-2 pb-2">
                                        <Col>
                                            <ListGroup className="w-l over-y">
                                                <this.createListAvaliableHours />
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
                                        <tbody className="table-sm schedule-elective">
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
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                    <Button className="rounded-10" form="formulario" variant="primary" type="submit">Registrar</Button>
                </Modal.Footer>
                <div className="no-login time">
                    <Alert variant="danger" show={this.state.show} onClose={handleDismiss} dismissible>
                        <p className="mb-0">{this.state.message}</p>
                    </Alert>
                </div>
            </>
        );
    }
}