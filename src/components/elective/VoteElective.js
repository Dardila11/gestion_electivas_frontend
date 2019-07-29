import React, { Component } from "react";
import { Modal, Button, Alert, Row, Card } from "react-bootstrap";
import axios from "axios";

import "../../css/Table.css";

export default class VoteElective extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            elective: props.elective,
            elective_id: "",
            schedules: [],
            show: false,
            message: ""
        };
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

    //REQUESTS SERVER
    //- - - - - - - - - - - - - - - -

    //LOAD DATA
    loadSchedules() {
        axios.get("http://localhost:8000/api/course/schedule/professor/" + this.state.elective)
            .then((response) => { this.setState({ schedules: response.data }) })
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListSchedules() {
        console.log(this.state.schedules)
        const listItems = this.state.schedules.map((schedule) =>
        <div  key={schedule.schedule} className="col-md-4">
            <Card className="text-center">
                <Card.Header>{schedule.schedule__avaliable__classroom__classroom_id} {schedule.schedule__avaliable__classroom__faculty__name}</Card.Header>
                <Card.Body>
                    <Card.Title>{schedule.classroom__name} {schedule.classroom__faculy__name} </Card.Title>
                    <Card.Text>
                        <span>{schedule.schedule__avaliable__schedule__day} | {schedule.schedule__avaliable__schedule__time_from} - {schedule.schedule__avaliable__schedule__time_to}</span>
                    </Card.Text>
                    <Button variant="primary">Votar</Button>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card>
            </div>
        );
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