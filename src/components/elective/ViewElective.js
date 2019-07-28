import React, { Component } from "react";
import { Form, Modal, Button, Table, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

import "../../css/Table.css";
import { time, addSchedule } from "../../js/HandleDOM";
import { unhashHour, unhashDay } from "../../js/HandleSchedule";
registerLocale("es", es);

export default class updateElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            elective: props.elective,
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
            avaliable_hours: [],
            professors: [],
            show: false,
            message: ""
        };
        this.loadElective = this.loadElective.bind(this);
        this.loadAvaliables = this.loadAvaliables.bind(this);
        this.loadClassrooms = this.loadClassrooms.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.loadProfessors = this.loadProfessors.bind(this);
        this.createListClassrooms = this.createListClassrooms.bind(this);
        this.createListProfessors = this.createListProfessors.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleCloseUpdate = () => {
        this.props.handleCloseUpdate();
    }

    //REQUESTS SERVER
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

    loadAvaliables() {
        axios.get("http://localhost:8000/api/avaliable/course/" + this.state.elective)
            .then((response) => {
                console.log(response)
                var i;
                const data = response.data;
                for (i = 0; i < data.length; i++) {
                    var id = data[i].id;
                    var inicio = data[i].avaliable__schedule__time_from;
                    var fin = data[i].avaliable__schedule__time_to;
                    var dia = data[i].avaliable__schedule__day;
                    if (addSchedule(unhashHour(inicio), unhashHour(fin), unhashDay(dia), "schedule-elective")) {
                        this.state.avaliable_hours.push({ "id": id, "time_from": inicio, "time_to": fin, "day": dia, "schedule": data[i].schedule });
                    }
                }
                this.setState({ avaliable_hours: this.state.avaliable_hours })
            })
    }

    loadElective() {
        axios.get("http://localhost:8000/api/course/" + this.state.elective)
            .then(response =>
                this.setState({
                    elective_id: response.data[0].course__id,
                    quota: response.data[0].quota,
                    priority: response.data[0].priority,
                    professor: response.data[0].professor__id,
                }))
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListClassrooms() {
        const listItems = this.state.classrooms.map((classroom) =>
            <option key={classroom.id} value={classroom.id}>{classroom.classroom_id} | {classroom.faculty__name}</option>
        );
        return listItems;
    }

    createListProfessors() {
        const listItems = this.state.professors.map((professor) =>
            <option key={professor.id} value={professor.id}>{professor.first_name} {professor.last_name}</option>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadClassrooms();
        this.loadProfessors();
        this.loadElective();
        this.loadAvaliables();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles electiva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form id="formulario" onSubmit={this.updateElective}>
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
                                <Col className="col-sm-12">
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