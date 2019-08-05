import React, { Component } from 'react';
import { Form, Button, Row, Col, Modal, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import '../../css/Table.css';
import { time } from "../../js/HandleDOM";
import { URL } from "../../utils/URLServer"
import Autosuggest from 'react-autosuggest';

export default class addStudentStudent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            codigo: "",
            nombres: "",
            apellidos: "",
            usuario: "",
            elective: -1,
            students: [],
            electives: [],
            value: '',
            suggestions: [],
            enrrollments: [],
            show: false
        };
        this.createStudent = this.createStudent.bind(this);
        this.loadStudents = this.loadStudents.bind(this);
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
                okCourse = true;
            });
        const { enrrollments } = this.state;
        json = {
            "student": codigo,
            "enrrollments": enrrollments
        }
        await axios.put(URL + "api/enrrollment/", json)
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
    loadStudents() {
        axios.get(URL + "api/student/")
            .then((response) => {
                this.setState({ students: response.data })
                console.log(response)
            })
                
    }

    loadElectives() {
        const semester = parseInt(localStorage.getItem("semester"));
        axios.post(URL + "api/course/semester/" + semester)
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
        this.loadStudents();
    }
    //- - - - - - - - - - - - - - - -

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    getSuggestionValue = suggestion => suggestion.user_id.toString();

    // Use your imagination to render suggestions.
    renderSuggestion = suggestion => (
        <div>
            {suggestion.user_id}
        </div>
    );

    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = value => {
        const inputValue = value.toString().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.students.filter(lang =>
            lang.user_id.toString().toLowerCase().slice(0, inputLength) === inputValue
        );
    };


    onSuggestionsFetchRequested = ({ value }) => {

        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onChange = (event, { newValue, method }) => {
        const elective = this.state.students.find(elective => elective.user_id === parseInt(newValue));
        if (elective !== undefined) {
            this.setState({ codigo: elective.user_id, nombres: elective.first_name, apellidos: elective.last_name, usuario: elective.username });
        }
        this.setState({
            value: newValue
        });
    };

    render() {
        // Autosuggest will pass through all these props to the input.
        const { value, suggestions } = this.state;
        const inputProps = {
            className: "form-control",
            placeholder: 'Codigo*',
            value,
            onChange: this.onChange
        };
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
                                        <Form.Label><span className="ml-0">Código<span className="obligatorio">*</span></span></Form.Label>
                                        <Autosuggest 
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            inputProps={inputProps}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Usuario<span className="obligatorio">*</span></span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="usuario" value={this.state.usuario} onChange={this.handleChange} placeholder="Usuario*" required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Nombres<span className="obligatorio">*</span></span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="nombres" value={this.state.nombres} onChange={this.handleChange} placeholder="Nombres*" required />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Apellidos<span className="obligatorio">*</span></span></Form.Label>
                                        <Form.Control className="ml-0" type="text" name="apellidos" value={this.state.apellidos} onChange={this.handleChange} placeholder="Apellidos*" required />
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