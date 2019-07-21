import React, { Component } from 'react';
import { Image, Button, Table, Modal } from 'react-bootstrap';
// import axios from 'axios';

import AddElective from './AddElective';

export default class ListElective extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			show: false
		};
		this.handleClose = this.handleClose.bind(this);
		this.handleShow = this.handleShow.bind(this);
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	render() {
		return (
			<>
				<div className="title pt-4 mb-2">
					<h4 className="d-inline white">Gestionar electivas</h4>
					<Button className="d-inline float-right btn btn-light mb-2" onClick={this.handleShow}><Image src="./img/mas.png" alt="" /></Button>
				</div>
				<Table striped bordered hover responsive="xl" size="xl">
					<thead>
						<tr>
							<th>#</th>
							<th>Código</th>
							<th>Nombre</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>SIS-483</td>
							<td>Minería de Datos</td>
							<td>
								<Button className="btn mr-2 beige"><Image src="./img/ver.png" alt="" /></Button>
								<Button className="btn mr-2 beige"><Image src="./img/editar.png" alt="" /></Button>
								<Button className="btn beige"><Image src="./img/borrar.png" alt="" /></Button>
							</td>
						</tr>
					</tbody>
				</Table>
				<Modal className="modal-custom" show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Registrar electiva</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<AddElective />
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Cerrar
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}