import React, { Component } from "react";
import { Form, Button, Alert, Row, Col, Modal } from "react-bootstrap";

import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { time } from "../../js/HandleDOM";
registerLocale("es", es);

export default class FormStartElectivesProcess extends Component {
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    constructor(props, context) {
        super(props, context);
        this.state = {
            year: -1,
            period: -1,
            semesterDateFrom: new Date(),
            semesterDateTo: new Date(),
            redirect: false,
            show: false,
            showAlertThis: false,
            showAlertModal: false,
            semester: -1,
            semesters: [],
            message: ""
        };
        this.createSemester = this.createSemester.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    //HANDLE DATE AND TIME
    handleChangeSemesterDateFrom = (date) => {
        this.setState({ semesterDateFrom: date });
    }

    handleChangeSemesterDateTo = (date) => {
        this.setState({ semesterDateTo: date });
    }
    //- - - - - - - - - - - - - - - -

    redirect() {
        localStorage.setItem("semester", this.state.semester);
        this.setState({ redirect: true });
    }

    selectSemester = () => {
        if (parseInt(this.state.semester) !== -1) {
            this.redirect();
        } else {
            this.setState({ message: "Eliga un semester", showAlertModal: true });
            time();
        }
    }

    //REQUESTS SERVER
    createSemester(event) {
        event.preventDefault();
        if (parseInt(this.state.year) !== -1 || parseInt(this.state.period) !== -1) {
            const { year, period, semesterDateFrom, semesterDateTo } = this.state;
            if (Date.parse(semesterDateFrom) < Date.parse(semesterDateTo)) {
                const from_date = semesterDateFrom.getFullYear() + "-" + semesterDateFrom.getMonth() + "-" + semesterDateFrom.getDay();
                const until_date = semesterDateTo.getFullYear() + "-" + semesterDateTo.getMonth() + "-" + semesterDateTo.getDay();
                var json = {
                    "year": parseInt(year),
                    "period": parseInt(period),
                    "from_date": from_date,
                    "until_date": until_date
                }
                axios.post("http://localhost:8000/api/semester/", json)
                    .then((response) => { this.setState({ semester: response.data[0].pk }); this.redirect(response) })
                    .catch(error => {
                        this.setState({ error: true })
                    });
            } else {
                this.setState({ message: "La Fecha Final debe ser mayor a la Fecha de Inicio", showAlertThis: true });
                time();
                console.log("La fecha final debe ser mayor a la fecha de inicio");
            }
        } else {
            this.setState({ message: "Eliga un año y periodo", showAlertThis: true });
            time();
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadSemesters = () => {
        axios.get("http://localhost:8000/api/semester/")
            .then(response =>
                this.setState({ semesters: response.data })
            )
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListSemesters = () => {
        const listItems = this.state.semesters.map((semester) =>
            <option key={semester.pk} value={semester.pk}>{semester.fields.year} - {semester.fields.period}</option>
        );
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadSemesters();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        if (this.state.redirect) {
            return <Redirect to="/dashboard" />;
        }
        const handleShow = () => this.setState({ show: true, showAlertModal: false });
        const handleDismiss = () => this.setState({ show: false, showAlertModal: false });
        return (
            <>
                <div className="card m-3">
                    <div className="card-header">
                        <span className="center font-weight-bold">INICIAR PROCESO DE ELECTIVAS</span>
                    </div>
                    <div className="card-body">
                        <Form id="formulario" onSubmit={this.createSemester}>
                            <Row>
                                <Col>
                                    <Form.Label><span className="h5">Semestre</span></Form.Label>
                                    <Form.Group>
                                        <Row>
                                            <Col className="col-lg-2">
                                                <Form.Label><span >Año</span></Form.Label>
                                                <Form.Control name="year" as="select" onChange={this.handleChange}>
                                                    <option value={-1}>-----</option>
                                                    <option value="2019">2019</option>
                                                    <option value="2020">2020</option>
                                                    <option value="2021">2021</option>
                                                </Form.Control>
                                            </Col>
                                            <Col className="col-lg-2">
                                                <Form.Label><span >Periodo</span></Form.Label>
                                                <Form.Control name="period" as="select" onChange={this.handleChange}>
                                                    <option value={-1}>-----</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Form.Label><span className="h5">Fechas de Semestre</span></Form.Label>
                                    <Form.Group>
                                        <Row>
                                            <Col className="col-lg-3">
                                                <Form.Label><span >Inicio</span></Form.Label>
                                                <Form.Group className="mb-0">
                                                    <DatePicker className="form-control"
                                                        selected={this.state.semesterDateFrom}
                                                        selectsStart
                                                        voteDateFrom={this.state.semesterDateFrom}
                                                        voteDateTo={this.state.semesterDateTo}
                                                        onChange={this.handleChangeSemesterDateFrom}
                                                        placeholderText="Fecha Inicio"
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col className="col-lg-3">
                                                <Form.Label><span >Final</span></Form.Label>
                                                <Form.Group className="mb-0">
                                                    <DatePicker className="form-control"
                                                        selected={this.state.semesterDateTo}
                                                        selectsStart
                                                        voteDateFrom={this.state.semesterDateFrom}
                                                        voteDateTo={this.state.semesterDateTo}
                                                        onChange={this.handleChangeSemesterDateTo}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="Fecha Final"
                                                        minDate={this.state.semesterDateFrom}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex">
                            <Button className="rounded-10 mr-1" form="formulario" variant="primary" type="submit">Iniciar nuevo semestre</Button>
                            <Button className="rounded-10" variant="secondary" onClick={handleShow}>Seleccionar uno anterior</Button>
                        </div>
                    </div>
                </div>
                <Modal className="modal-custom" show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Seleccionar semestre</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-fluid">
                            <Row>
                                <Col className="col-sm-3 col-xl-2">
                                    <Form.Label><span className="ml-0">Semestre</span></Form.Label>
                                    <Form.Control className="ml-0" as="select" name="semester" value={this.state.semester} onChange={this.handleChange}>
                                        <option value={-1}>-----</option>
                                        <this.createListSemesters />
                                    </Form.Control>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex">
                            <Button variant="primary mr-1" onClick={this.selectSemester}>Seleccionar semestre</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                        </div>
                    </Modal.Footer>
                    <div className="no-login time">
                        <Alert variant="danger" show={this.state.showAlertModal} onClose={handleDismiss} dismissible>
                            <p className="mb-0">{this.state.message}</p>
                        </Alert>
                    </div>
                </Modal>
                <div className="no-login time">
                    <Alert variant="danger" show={this.state.showAlertThis} onClose={handleDismiss} dismissible>
                        <p className="mb-0">{this.state.message}</p>
                    </Alert>
                </div>
            </>
        )
    }
}