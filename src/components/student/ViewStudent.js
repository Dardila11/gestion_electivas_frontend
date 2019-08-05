import React, { Component } from 'react';
import { Form, Button, Row, Col, Modal, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';
import { URL } from "../../utils/URLServer"

export default class ViewStudent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            student: props.student,
            codigo: "",
            nombres: "",
            apellidos: "",
            usuario: "",
            elective: -1,
            enrrollments: [],
            show: false
        };
        this.loadStudent = this.loadStudent.bind(this);
        this.loadEnrrollments = this.loadEnrrollments.bind(this);
        this.createListEnrrollments = this.createListEnrrollments.bind(this);
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    //REQUESTS SERVER
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadStudent() {
        axios.post(URL + "api/student/" + this.state.student)
            .then(response =>
                this.setState({
                    codigo: response.data[0].user_id,
                    nombres: response.data[0].first_name,
                    apellidos: response.data[0].last_name,
                    usuario: response.data[0].username
                }))
    }

    loadEnrrollments() {
        const semester = parseInt(localStorage.getItem("semester"));
        axios.post(URL + "api/enrrollment/" + this.state.student + "/" + semester)
            .then(response =>
                this.setState({ enrrollments: response.data }))
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListEnrrollments() {
        const listItems = this.state.enrrollments.map((enrrollment) =>
            <ListGroup.Item
                className="text-s1"
                key={enrrollment.course__id + enrrollment.course__course__name} >
                {enrrollment.course__course__name + " - " + enrrollment.course__professor__first_name + enrrollment.course__professor__last_name}
            </ListGroup.Item>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadStudent();
        this.loadEnrrollments();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles estudiante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form id="formulario" onSubmit={this.updateStudent}>
                            <Row className="mb-3">
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Código</span></Form.Label>
                                        <Form.Control disabled="disabled" className="ml-0" type="number" name="codigo" value={this.state.codigo} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Usuario</span></Form.Label>
                                        <Form.Control disabled="disabled" className="ml-0" type="text" name="usuario" value={this.state.usuario} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Nombres</span></Form.Label>
                                        <Form.Control disabled="disabled" className="ml-0" type="text" name="nombres" value={this.state.nombres} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Apellidos</span></Form.Label>
                                        <Form.Control disabled="disabled" className="ml-0" type="text" name="apellidos" value={this.state.apellidos} onChange={this.handleChange} required />
                                    </Form.Group>
                                </div>
                            </Row>
                            <Row>
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