import React, { Component } from "react";
import { Button, Table, Modal, Alert, Pagination, Card } from "react-bootstrap";
import axios from "axios";
import { time, changePage } from "../../js/HandleDOM";

export default class ListElectives extends Component {
    constructor(props, context){
        super(props,context);
        this.state = {
            ListElectives: [],
            showView: false,
			showCreate: false,
			showUpdate: false,
			showAlert: false,
			showMessage: false
        };
        //this.loadElectives = this.loadElectives.bind(this);
    }

    handleClose = () => {
		this.setState({ showView: false, showCreate: false, showUpdate: false, showAlert: false });
		this.loadClassrooms();
	}

	handleCloseCreate = () => {
		this.setState({ showMessage: true, message: "Horario registrado" });
		this.handleClose();
		time();
	}

	handleCloseUpdate = () => {
		this.setState({ showMessage: true, message: "Cambios guardados" });
		this.handleClose();
		time();
    }
    
    create = () => {
		this.setState({ showCreate: true });
	}
    


    render() {
        return (
            <div>
                <Card style={{ width: '18rem', top: '2rem' }}>
                    <Card.Header as="h5">Electiva #1</Card.Header>
                    <Card.Body>
                        <Card.Title>Desarrollo de Videojuegos</Card.Title>
                        <Card.Text>
                        </Card.Text>
                        <Button variant="primary" onClick={this.create}>Registrar horarios disponibles</Button>
                        <Modal className="modal-dialog-centered" show={this.state.showCreate} onhide={this.handleClose}>
                            <div>Este es el modal</div>
                        </Modal>

                    </Card.Body>
                </Card>
            </div>
        )

    }
}