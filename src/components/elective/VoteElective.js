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
            votes_add: [],
            votes_delete: [],
            show: false,
            showAlert: false,
            message: ""
        };
        this.saveVotes = this.saveVotes.bind(this);
        this.loadSchedules = this.loadSchedules.bind(this);
        this.loadVotes = this.loadVotes.bind(this);
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

    handleCloseVote = () => {
        this.props.handleCloseVote();
    }

    votar = (event) => {
        this.state.votes.push({ "schedule": parseInt(event.target.value) });
        this.state.votes_add.push({ "schedule": parseInt(event.target.value) });
        this.setState({ schedules: this.state.schedules });
    }

    cancelar = (event) => {
        var i = 0;
        for (const vote of this.state.votes) {
            var is_history = false;
            if (vote.schedule === parseInt(event.target.value)) {
                var j = 0;
                for (const vote_add of this.state.votes_add) {
                    if (vote_add.schedule === parseInt(event.target.value)) {
                        this.state.votes_add.splice(j, 1);
                        break;
                    }
                    j++;
                }
                if (!is_history) {
                    this.state.votes_delete.push(this.state.votes[i]);
                }
                this.state.votes.splice(i, 1);
                break;
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
            const { votes_add, votes_delete } = this.state;
            const json = {
                "student": "cblanco",
                "schedules_add": votes_add,
                "schedules_delete": votes_delete
            }
            axios.put("http://localhost:8000/api/student/vote/", json)
                .then(() => {
                    this.handleCloseVote();
                })
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

    loadVotes() {
        axios.get("http://localhost:8000/api/student/vote/" + this.state.elective + "/cblanco")
            .then((response) => {
                this.setState({ votes: response.data })
            })
    }
    //- - - - - - - - - - - - - - - -

    //CREATE HTML
    createListSchedules() {
        const listItems = [];
        for (const schedule of this.state.schedules) {
            var buttonvote;
            var existe = this.state.votes.find(vote => vote.schedule === parseInt(schedule.schedule)) !== undefined;
            if (!existe) {
                buttonvote = <Button value={schedule.schedule} variant="primary" onClick={this.votar}>Votar</Button>;
            } else {
                buttonvote = <Button value={schedule.schedule} variant="danger" onClick={this.cancelar}>Cancelar</Button>;
            }
            listItems.push(<div key={schedule.schedule} className="col-md-6">
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
        this.loadVotes();
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
                    <Button variant="primary" onClick={this.saveVotes}>Guardar cambios</Button>
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