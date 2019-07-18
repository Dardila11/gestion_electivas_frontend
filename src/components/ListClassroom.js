import React, { Component } from 'react';
import { Image, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

import AddClassroom from './AddClassroom';

export default class ListClassroom extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: -1,
			listClassroom: [],
			show: false,
			showAlert: false
		};
		this.handleClose = this.handleClose.bind(this);
		this.handleShow = this.handleShow.bind(this);
		this.loadClassrooms = this.loadClassrooms.bind(this);
		this.createTableClassrooms = this.createTableClassrooms.bind(this);
		this.ver = this.ver.bind(this);
		this.editar = this.editar.bind(this);
		this.eliminar = this.eliminar.bind(this);
		this.preguntar = this.preguntar.bind(this);
	}

	handleClose() {
		this.setState({ show: false, showAlert: false });
		this.loadClassrooms();
	}

	handleShow() {
		this.setState({ show: true });
	}

	ver(event) {
		console.log(event.currentTarget.value);
		//this.props.clickHandler()
	}

	editar(event) {
		console.log(event.currentTarget.value);
	}

	eliminar(event) {
		this.setState({ showAlert: false });
		axios.delete('http://localhost:8000/api/deleteclassroom/' + this.state.id)
			.then(() => {
				this.loadClassrooms()
			})
	}

	preguntar(event) {
		if (event.currentTarget.name === 'eliminar') {
			this.setState({ id: event.currentTarget.value });
			this.setState({ showAlert: true });
		}
	}

	createTableClassrooms() {
		const listItems = this.state.listClassroom.map((classroom) =>
			<tr key={classroom.pk}>
				<td>{classroom.fields.classroom_id}</td>
				<td>{classroom.fields.capacity}</td>
				<td>
					<Button className="btn mr-2 beige" onClick={this.ver} value={classroom.pk}><Image src="./img/ver.png" alt="" /></Button>
					<Button className="btn mr-2 beige" onClick={this.editar} value={classroom.pk}><Image src="./img/editar.png" alt="" /></Button>
					<Button className="btn beige" name="eliminar" onClick={this.preguntar} value={classroom.pk}><Image src="./img/borrar.png" alt="" /></Button>
				</td>
			</tr>
		);
		return listItems;
	}

	componentWillMount() {
		this.loadClassrooms();
	}

	async loadClassrooms() {
		await axios.post('http://localhost:8000/api/classroom/')
			.then(response =>
				this.setState({ listClassroom: response.data }))
		console.log('load salon')
	}

	render() {
		return (
			<>
				<div className="title pt-4 mb-0">
					<h4 className="d-inline white h-100">Gestionar Salones</h4>
					<Button className="d-inline float-right btn btn-light mb-2" onClick={this.handleShow}><Image src="./img/mas.png" alt="" /></Button>
				</div>
				<Table striped bordered hover responsive="xl" size="xl">
					<thead>
						<tr>
							<th>No. Salón</th>
							<th>Capacidad</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody>
						<this.createTableClassrooms />
					</tbody>
				</Table>
				{/* Registrar salón */}
				<Modal className="modal-custom" show={this.state.show} onHide={this.handleClose}>
					<AddClassroom handleClose={this.handleClose} />
				</Modal>
				{/* Eliminar salón */}
				<Modal show={this.state.showAlert} onHide={this.handleClose}>
					<Modal.Body>
						<span>¿Seguro desea eliminar el salón?</span>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
						<Button variant="primary" name="eliminar" onClick={this.eliminar}>Aceptar</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}