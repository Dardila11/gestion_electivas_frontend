import React, { Component } from "react";
import { Form, Modal, Button, Table, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

import "../../css/Table.css";
import { addSchedule } from "../../js/HandleDOM";
import { unhashHour, unhashDay } from "../../js/HandleSchedule";
import { URL } from "../../utils/URLServer";

export default class ViewClassroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            classroom: props.classroom,
            classroom_id: "",
            capacity: "",
            description: "",
            faculty: 1,
            time_from: 1,
            time_to: 1,
            day: 1,
            faculties: [],
            schedules: [],
            schedules_add: [],
            schedules_delete: [],
            message: "",
            show: false
        };
        this.loadClassroom = this.loadClassroom.bind(this);
        this.createListFaculties = this.createListFaculties.bind(this);
        this.loadFaculties = this.loadFaculties.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleClose = () => {
        this.props.handleClose();
    }

    //LOAD DATA
    loadFaculties() {
        axios.post(URL + "api/faculty/")
            .then(response =>
                this.setState({ faculties: response.data }))
    }

    loadSchedules(data) {
        var i;
        for (i = 0; i < data.length; i++) {
            var inicio = data[i].schedule__time_from;
            var fin = data[i].schedule__time_to;
            var dia = data[i].schedule__day;
            if (addSchedule(unhashHour(inicio), unhashHour(fin), unhashDay(dia), "schedule-classroom")) {
                this.state.schedules.push({ "time_from": inicio, "time_to": fin, "day": dia, "schedule": data[i].schedule });
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
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadFaculties();
        this.setState({ showAlert: false });
        axios.get(URL + "api/getclassroom/" + this.state.classroom)
            .then((response) => {
                this.loadClassroom(response.data[0])
            })
        axios.get(URL + "api/schedule/" + this.state.classroom)
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
                    <Modal.Title>Detalles salón</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form id="formulario" onSubmit={this.updateClassroom}>
                            <Row className="bb-1-g mb-3">
                                <Col className="col-sm-3 col-xl-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">No. Salón</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="classroom_id" value={this.state.classroom_id} onChange={this.handleChange} placeholder="No. salón" required />
                                    </Form.Group>
                                </Col>
                                <Col className="col-sm-3 col-xl-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Capacidad</span></Form.Label>
                                        <Form.Control className="ml-0" type="number" name="capacity" value={this.state.capacity} onChange={this.handleChange} placeholder="Capacidad" required />
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
                                        <tbody className="table-sm schedule-classroom">
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
                                        <Form.Label><span className="ml-0">Descripción</span></Form.Label>
                                        <textarea className="form-control" name="description" id="" value={this.state.description} onChange={this.handleChange} required></textarea>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="no-login time">
                        <Alert variant="danger" show={this.state.show} onClose={handleDismiss} dismissible>
                            <p className="mb-0">{this.state.message}</p>
                        </Alert>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>
            </>
        );
    }
}