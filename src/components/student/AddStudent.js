import React, { Component } from 'react';
import { Form, Button, Row, Col, Modal, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';
import { time } from "../../js/HandleDOM";

export default class addStudentStudent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            codigo: "",
            nombres: "",
            apellidos: "",
            usuario: "",
            elective: -1,
            electives: [],
            enrrollments: [],
            show: false
        };
        this.createStudent = this.createStudent.bind(this);
        this.loadElectives = this.loadElectives.bind(this);
        this.createListElectives = this.createListElectives.bind(this);
        this.createListEnrrollments = this.createListEnrrollments.bind(this);
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleCloseCreate = () => {
        this.props.handleCloseCreate();
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    addElective = () => {
        const elective = this.state.electives.find(course => course.id === parseInt(this.state.elective));
        if (parseInt(this.state.elective) !== -1) {
            const isExists = this.state.enrrollments.find(course => course.id === parseInt(this.state.elective)) !== undefined;
            if (!isExists) {
                this.state.enrrollments.push({ "id": elective.id, "name": elective.course__name, "professor": elective.professor__first_name + elective.professor__last_name });
                this.setState({ enrrollments: this.state.enrrollments });
            } else {
                time();
                this.setState({ message: "El curso ya esta matriculado", show: true });
            }
        } else {
            time();
            this.setState({ message: "Elija una curso", show: true });
        }
    }

    removeEnrrollment = (event) => {
        var enrrollment;
        var i = 0;
        for (enrrollment of this.state.enrrollments) {
            if (parseInt(event.target.value) === enrrollment.id) {
                this.state.enrrollments.splice(i, 1);
                break;
            }
            i++;
        }
        this.setState({ enrrollments: this.state.enrrollments });
    }

    //REQUESTS SERVER
    async createStudent(event) {
        event.preventDefault();
        var okCourse = false;
        var okSchedules = false;
        const { codigo, nombres, apellidos, usuario } = this.state;
        var json = {
            "user_id": codigo,
            "username": usuario,
            "first_name": nombres,
            "last_name": apellidos,
            "password": "ninguna"
        }
        await axios.put('http://localhost:8000/api/student/', json)
            .then(function (response) {
                console.log(response);
            });
        const { enrrollments } = this.state;
        json = {
            "student": codigo,
            "enrrollments": enrrollments
        }
        await axios.put("http://localhost:8000/api/enrrollment/", json)
            .then(() => {
                okSchedules = true;
            })
            .catch(error => {
                if (error.response.status) {
                    time();
                    this.setState({ message: "Algunas materias ya estan matriculadas", show: true });
                }
            });
        if (okCourse && okSchedules) {
            this.handleCloseCreate();
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadElectives() {
        const semester = parseInt(localStorage.getItem("semester"));
        axios.post("http://localhost:8000/api/course/semester/" + semester)
            .then(response =>
                this.setState({ electives: response.data }))
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListEnrrollments() {
        const listItems = this.state.enrrollments.map((enrrollment) =>
            <ListGroup.Item
                className="text-s1"
                key={enrrollment.id} >
                {enrrollment.name + " - " + enrrollment.professor}
                <Button name="schedule" value={enrrollment.id} onClick={this.removeEnrrollment} className="mouse float-right text-sm p-0">x</Button>
            </ListGroup.Item>
        );
        return listItems;
    }

    createListElectives() {
        const listItems = this.state.electives.map((elective) =>
            <option key={elective.id} value={elective.id}>{elective.course__name}</option>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadElectives();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar estudiante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form id="formulario" onSubmit={this.createStudent}>
                            <Row className="mb-3">
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Código</span></Form.Label>
                                        <Form.Control className="ml-0" type="number" name="codigo" value={this.state.codigo} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Usuario</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="usuario" value={this.state.usuario} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Nombres</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="nombres" value={this.state.nombres} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Apellidos</span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="apellidos" value={this.state.apellidos} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-4  mb-3">
                                    <Row>
                                        <div className="col-12">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Electiva</span></Form.Label>
                                                <Form.Control className="ml-0" as="select" name="elective" value={this.state.elective} onChange={this.handleChange}>
                                                    <option key={-1} value={-1}>-----</option>
                                                    <this.createListElectives />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                        <div className="col-12">
                                            <Button className="rounded-10 w-100" variant="primary" onClick={this.addElective}>Agregar</Button>
                                        </div>
                                    </Row>
                                </div>
                                <div data-simplebar className="w-l over-y col-md-4">
                                    <Row>
                                        <Col>
                                            <Form.Label><span className="ml-0">Matriculas</span></Form.Label>
                                            <ListGroup>
                                                <this.createListEnrrollments />
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </Row>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="rounded-10" form="formulario" variant="primary" type="submit">Registrar</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
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