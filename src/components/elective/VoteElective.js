import React, { Component } from "react";
import { Modal, Button, Alert, Row, Card } from "react-bootstrap";
import axios from "axios";

import { time } from "../../js/HandleDOM";
import "../../css/Table.css";

export default class VoteElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            elective: props.elective,
            elective_id: "",
            schedules: [],
            votes: [],
            show: false,
            showAlert: false,
            message: ""
        };
        this.saveVotes = this.saveVotes.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.createListSchedules = this.createListSchedules.bind(this);
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

    preguntar = () => {
        this.setState({ showAlert: true });
    }

    votar = (event) => {
        this.state.votes.push(parseInt(event.target.value));
        this.setState({ schedules: this.state.schedules });
    }

    cancelar = (event) => {
        var i = 0;
        for (const vote of this.state.votes) {
            if (vote === parseInt(event.target.value)) {
                this.state.votes.splice(i, 1);
            }
            i++;
        }
        this.setState({ schedules: this.state.schedules });
    }

    //REQUESTS SERVER
    saveVotes() {
        const username = parseInt(localStorage.getItem("username"));
        this.setState({ showAlert: false });
        if (this.state.votes.length > 1) {
            const { votes } = this.state;
            const json = {
                "student": "cblanco",
                "schedules": votes
            }
            axios.put("http://localhost:8000/api/student/vote/", json)
                .then((response) => {
                    console.log(response);
                })
            this.handleClose();
        } else {
            time();
            this.setState({ show: true, message: "Debe votar por más de 1 franja horaria" });
        }
    }
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadSchedules() {
        axios.get("http://localhost:8000/api/course/schedule/professor/" + this.state.elective)
            .then((response) => {
                this.setState({ schedules: response.data })
            })
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListSchedules() {
        console.log(this.state.schedules);
        const listItems = [];
        for (const schedule of this.state.schedules) {
            var buttonvote;
            var existe = this.state.votes.find(vote => vote === parseInt(schedule.schedule)) !== undefined;
            if (!existe) {
                buttonvote = <Button value={schedule.schedule} variant="primary" onClick={this.votar}>Votar</Button>;
            } else {
                buttonvote = <Button value={schedule.schedule} variant="danger" onClick={this.cancelar}>Cancelar</Button>;
            }
            listItems.push(<div key={schedule.schedule} className="col-md-4">
                <Card className="text-center">
                    <Card.Header>{schedule.schedule__avaliable__classroom__classroom_id} {schedule.schedule__avaliable__classroom__faculty__name}</Card.Header>
                    <Card.Body>
                        <Card.Title>{schedule.classroom__name} {schedule.classroom__faculy__name} </Card.Title>
                        <Card.Text>
                            <span>{schedule.schedule__avaliable__schedule__day} | {schedule.schedule__avaliable__schedule__time_from} - {schedule.schedule__avaliable__schedule__time_to}</span>
                        </Card.Text>
                        {buttonvote}
                    </Card.Body>
                    <Card.Footer className="text-muted">2 days ago</Card.Footer>
                </Card>
            </div>)
        }
        return listItems;
    }
    //- - - - - - - - - - - - - - - -

    //METHODS LIFESPAN COMPONENT
    componentWillMount() {
        this.loadSchedules();
    }
    //- - - - - - - - - - - - - - - -

    render() {
        const handleDismiss = () => this.setState({ show: false });
        const handleDismissAlert = () => this.setState({ showAlert: false });
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Votar horarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="h6">Recuerde votar por horarios donde pueda asistir</div>
                        <Row>
                            <this.createListSchedules />
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.preguntar}>Guardar cambios</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
                </Modal.Footer>
                {/* Pregunta guardar cambios */}
                <div className="no-login">
                    <Alert variant="warning" show={this.state.showAlert} onClose={handleDismissAlert}>
                        <Alert.Heading>¿Seguro deseea guardar cambios?</Alert.Heading>
                        <span>Recuerde que solo cuenta una oportunidad por curso</span>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button className="mr-1" variant="secondary" onClick={handleDismissAlert}>Cancelar</Button>
                            <Button variant="primary" name="eliminar" onClick={this.saveVotes}>Aceptar</Button>
                        </div>
                    </Alert>
                </div>
                <div className="no-login time">
                    <Alert variant="danger" show={this.state.show} onClose={handleDismiss} dismissible>
                        <p className="mb-0">{this.state.message}</p>
                    </Alert>
                </div>
            </>
        );
    }
}