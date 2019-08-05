import React, { Component } from "react";
import { Modal, Form, Button, Table, Alert, Row, ListGroup } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

import "../../css/Table.css";
import { time, addSchedule, removeSchedule } from "../../js/HandleDOM";
import { unhashHour, unhashDay } from "../../js/HandleSchedule";
import { URL } from "../../utils/URLServer";
import Autosuggest from 'react-autosuggest';
registerLocale("es", es);

export default class createElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            elective_id: -1,
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
            electives: [],
            value: '',
            suggestions: [],
            show: false,
            message: ""
        };
        this.createElective = this.createElective.bind(this);
        this.loadClassrooms = this.loadClassrooms.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.loadProfessors = this.loadProfessors.bind(this);
        this.loadElectives = this.loadElectives.bind(this);
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
        if (name === "schedule" && parseInt(value) !== -1) {
            axios.post(URL + "api/avaliable/get/" + value)
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
        if (parseInt(this.state.avaliable_hour) !== -1) {
            var isExists = this.state.avaliable_hours.find(avaliable => avaliable.id === this.state.avaliable_hour) === undefined;
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
    async createElective(event) {
        //TODO Registrar horarios
        event.preventDefault();
        var okCourse = false;
        var okSchedules = false;
        if (this.state.elective_id !== -1) {
            const semester = parseInt(localStorage.getItem("semester"));
            if (parseInt(this.state.priority) !== -1 || parseInt(this.state.professor) !== -1) {
                if (Date.parse(this.state.voteDateFrom) <= Date.parse(this.state.voteDateTo)) {
                    const { elective_id, quota, priority, professor, voteDateFrom, voteDateTo, voteTimeFrom, voteTimeTo } = this.state;
                    const from_date_vote = voteDateFrom.getFullYear() + "-" + (voteDateFrom.getMonth() + 1) + "-" + voteDateFrom.getDate() + "T" + voteTimeFrom.getHours() + ":" + voteTimeFrom.getMinutes() + ":" + voteTimeFrom.getSeconds();
                    const until_date_vote = voteDateTo.getFullYear() + "-" + (voteDateTo.getMonth() + 1) + "-" + voteDateTo.getDate() + "T" + voteTimeTo.getHours() + ":" + voteTimeTo.getMinutes() + ":" + voteTimeTo.getSeconds();
                    var json = {
                        "quota": quota,
                        "priority": priority,
                        "from_date_vote": from_date_vote,
                        "until_date_vote": until_date_vote,
                        "course": elective_id,
                        "professor": professor,
                        "semester": semester,
                    }
                    await axios.put(URL + "api/course/", json)
                        .then(() => {
                            okCourse = true
                        })
                        .catch(() => {
                            time();
                            this.setState({ message: "El curso ya esta incluido ", show: true });
                        })
                    //CREATE SCHEDULES TO CLASSROOM
                    const { avaliable_hours } = this.state;
                    json = {
                        "course": elective_id,
                        "semester": semester,
                        "schedules": avaliable_hours
                    }
                    await axios.put(URL + "api/course/schedule/", json)
                        .then(() => {
                            okSchedules = true;
                        })
                        .catch(() => {
                            time();
                            this.setState({ message: "Alguno de los horarios ya existe", show: true });
                        });
                } else {
                    time();
                    this.setState({ message: "La fecha final debe ser mayor a la fecha de inicio", show: true });
                }
            } else {
                time();
                this.setState({ message: "Elija un profesor y la prioridad", show: true });
            }
        } else {
            time();
            this.setState({ message: "Elija una electiva valida", show: true });
        }
        if (okCourse && okSchedules) {
            this.handleCloseCreate();
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    async loadElectives() {
        await axios.get(URL + "api/course/all")
            .then(response =>
                this.setState({ electives: response.data })
            )
    }

    loadClassrooms() {
        axios.get(URL + "api/classroom/")
            .then(response =>
                this.setState({ classrooms: response.data }))
    }

    loadSchedules(value) {
        axios.post(URL + "api/avaliable/" + value)
            .then(response =>
                this.setState({ schedules: response.data }))
    }

    loadProfessors() {
        axios.get(URL + "api/professor/")
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
        this.loadElectives();
    }
    //- - - - - - - - - - - - - - - -



    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    getSuggestionValue = suggestion => suggestion.name;

    // Use your imagination to render suggestions.
    renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const id = inputLength === 0 ? -1 : this.state.elective_id;

        this.setState({id: id})

        return inputLength === 0 ? [] : this.state.electives.filter(lang =>
            lang.name.toLowerCase().slice(0, inputLength) === inputValue
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
        const elective = this.state.electives.find(elective => elective.name === newValue);
        if (elective !== undefined) {
            console.log(elective.id)
            this.setState({ elective_id: elective.id });
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
            placeholder: 'Electiva*',
            value,
            onChange: this.onChange
        };
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar electiva en el semestre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form id="formulario" onSubmit={this.createElective}>
                            <Row className="bb-1-g mb-3">
                                <div className="col-sm-3 col-xl-2 col-lg-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Electiva<span className="obligatorio">*</span></span></Form.Label>
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
                                <div className="col-sm-3 col-xl-2 col-lg-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Cupos<span className="obligatorio">*</span></span></Form.Label>
                                        <Form.Control className="ml-0" type="number" name="quota" value={this.state.quota} onChange={this.handleChange} placeholder="Cupos*" required></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-sm-6 col-xl-3 col-lg-3">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Profesor<span className="obligatorio">*</span></span></Form.Label>
                                        <Form.Control className="ml-0" as="select" name="professor" value={this.state.professor} onChange={this.handleChange}>
                                            <option key={-1} value={-1}>-----</option>
                                            <this.createListProfessors />
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-sm-6 col-xl-2 col-lg-2">
                                    <Form.Group>
                                        <Form.Label><span className="ml-0">Prioridad<span className="obligatorio">*</span></span></Form.Label>
                                        <Form.Control className="ml-0" as="select" name="priority" value={this.state.priority} onChange={this.handleChange}>
                                            <option key={-1} value={-1}>-----</option>
                                            <option key={1} value={1}>Alta</option>
                                            <option key={2} value={2}>Media</option>
                                            <option key={3} value={3}>Baja</option>
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                            </Row>
                            <Row className="mt-2 bb-1-g mb-3">
                                <div>
                                    <Form.Label><span className="h5">Fechas de Votaciones</span></Form.Label>
                                    <Row>
                                        <div className="col-lg-4">
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
                                        </div>
                                        <div className="col-lg-4">
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
                                        </div>
                                    </Row>
                                </div>
                            </Row>
                            <Row className="bb-1-g mb-3">
                                <div className="col-sm-4">
                                    <Row>
                                        <div className="col-sm-12">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Salón</span></Form.Label>
                                                <Form.Control className="ml-0" as="select" name="classroom" value={this.state.classroom} onChange={this.handleChange}>
                                                    <option key={-1} value={-1}>-----</option>
                                                    <this.createListClassrooms />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                        <div className="col-sm-12">
                                            <Form.Group>
                                                <Form.Label><span className="ml-0">Disponibilidad</span></Form.Label>
                                                <Form.Control className="ml-0" as="select" name="schedule" value={this.state.schedule} onChange={this.handleChange}>
                                                    <option key={-1} value={-1}>-----</option>
                                                    <this.createListSchedules />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-sm-12">
                                            <Button className="rounded-10  w-100" variant="primary" onClick={this.addSchedule}>Agregar Horario</Button>
                                        </div>
                                    </Row>
                                    <Row className="pt-2 pb-2">
                                        <div data-simplebar className="w-l over-y">
                                            <ListGroup>
                                                <this.createListAvaliableHours />
                                            </ListGroup>
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-sm-8">
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