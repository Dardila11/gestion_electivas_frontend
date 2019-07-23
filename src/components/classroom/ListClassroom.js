import React, { Component } from 'react';
import { Button, Table, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

import { time } from '../../js/HandleDOM';
import AddClassroom from './AddClassroom';
import EditClassroom from './EditClassroom';

export default class ListClassroom extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: -1,
			listClassroom: [],
			showCreate: false,
			showUpdate: false,
			showAlert: false,
			showMessage: false
		};
		this.handleClose = this.handleClose.bind(this);		
		this.create = this.create.bind(this);
		this.loadClassrooms = this.loadClassrooms.bind(this);
		this.createTableClassrooms = this.createTableClassrooms.bind(this);
		this.update = this.update.bind(this);
		this.editar = this.editar.bind(this);
		this.eliminar = this.eliminar.bind(this);
		this.preguntar = this.preguntar.bind(this);
	}

	handleClose() {
		this.setState({ showCreate: false, showUpdate: false, showAlert: false });
		this.loadClassrooms();
	}

	handleCloseCreate = () => {
		this.setState({ showMessage: true, message: 'Salón creado' });
		this.handleClose();
		time();
	}

	handleCloseUpdate = () => {
		this.setState({ showMessage: true, message: 'Cambios guardados' });
		this.handleClose();
		time();
	}

	create() {
		this.setState({ showCreate: true });
	}

	update(event) {

	}

	editar(event) {
		this.setState({ showUpdate: true });
		this.setState({ id: event.target.value })
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

	//CREATE HTML
	createTableClassrooms() {
		const listItems = this.state.listClassroom.map((classroom) =>						
			<tr key={classroom.pk}>
				<td>{classroom.fields.classroom_id}</td>
				<td>{classroom.fields.capacity}</td>
				<td>
					<Button className="btn mr-2 beige ver" onClick={this.update} value={classroom.pk}></Button>
					<Button className="btn mr-2 beige editar" onClick={this.editar} value={classroom.pk}></Button>
					<Button className="btn beige borrar" name="eliminar" onClick={this.preguntar} value={classroom.pk}></Button>
				</td>
			</tr>
		);
		return listItems;
	}
	//- - - - - - - - - - - - - - - -

	//LOAD DATA
	async loadClassrooms() {
		await axios.get('http://localhost:8000/api/classroom/')
			.then(response =>
				this.setState({ listClassroom: response.data })
			)
	}
	//- - - - - - - - - - - - - - - -

	//METHODS LIFESPAN COMPONENT
	componentWillMount() {
		this.loadClassrooms();
	}
	//- - - - - - - - - - - - - - - -

	render() {
		const handleDismiss = () => this.setState({ showMessage: false });
		return (
			<>
				<div className="title pt-4 mb-0">
					<h4 className="d-inline white h-100">Gestionar Salones</h4>
					<Button className="d-inline float-right btn btn-light mb-2 agregar" onClick={this.create}></Button>
				</div>
				<Table striped bordered responsive="xl" size="xl">
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
				<Modal className="modal-custom" show={this.state.showCreate} onHide={this.handleClose}>
					<AddClassroom handleCloseCreate={this.handleCloseCreate} handleClose={this.handleClose} />
				</Modal>
				{/* Editar salón */}
				<Modal className="modal-custom" show={this.state.showUpdate} onHide={this.handleClose}>
					<EditClassroom handleCloseUpdate={this.handleCloseUpdate} handleClose={this.handleClose} salon={this.state.id} />
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
				<div className='no-login time'>
                    <Alert variant='success' show={this.state.showMessage} onClose={handleDismiss} dismissible>
                        <p className='mb-0'>{this.state.message}</p>
                    </Alert>
                </div>
			</>
		);
	}
}