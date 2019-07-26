import React, { Component } from 'react';
import { Button, Table, Modal, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';

import { time, changePage } from '../../js/HandleDOM';
import AddClassroom from './AddClassroom';
import EditClassroom from './EditClassroom';
import ViewClassroom from './ViewClassroom';

export default class ListClassroom extends Component {
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: -1,
			size: 0,
			page: 0,
			listClassroom: [],
			showView: false,
			showCreate: false,
			showUpdate: false,
			showAlert: false,
			showMessage: false
		};
		this.handleClose = this.handleClose.bind(this);
		this.create = this.create.bind(this);
		this.loadClassrooms = this.loadClassrooms.bind(this);
		this.createTableClassrooms = this.createTableClassrooms.bind(this);
		this.editar = this.editar.bind(this);
		this.eliminar = this.eliminar.bind(this);
		this.preguntar = this.preguntar.bind(this);
	}

	handleClose() {
		this.setState({ showView: false, showCreate: false, showUpdate: false, showAlert: false });
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

	ver = (event) => {
		this.setState({ showView: true });
		this.setState({ id: event.target.value });
	}

	create() {
		this.setState({ showCreate: true });
	}

	editar(event) {
		this.setState({ showUpdate: true });
		this.setState({ id: event.target.value });
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
					<div className="d-flex">
						<Button className="btn mr-2 beige ver" onClick={this.ver} value={classroom.pk}></Button>
						<Button className="btn mr-2 beige editar" onClick={this.editar} value={classroom.pk}></Button>
						<Button className="btn beige borrar" name="eliminar" onClick={this.preguntar} value={classroom.pk}></Button>
					</div>
				</td>
			</tr>
		);
		return listItems;
	}

	createPagination = () => {
		let items = [];
		for (let number = 1; number <= Math.ceil(this.state.size / 4); number++) {
			items.push(
				<Pagination.Item key={number} name={number} onClick={this.changeClassrooms}>
					{number}
				</Pagination.Item>,
			);
		}
		return items;
	}
	//- - - - - - - - - - - - - - - -

	//LOAD DATA
	changeClassrooms = (event) => {
		const init = (parseInt(event.target.name) - 1) * 4;
		const end = parseInt(event.target.name) * 4;
		changePage(parseInt(event.target.name));
		this.setState({ page: init });
		axios.get('http://localhost:8000/api/classroom/limit/' + init + '/' + end, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ listClassroom: response.data })
			)
	}

	async loadClassrooms() {
		var init = this.state.page;
		await axios.get('http://localhost:8000/api/classroom/count/', { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ size: response.data })
			)
		await axios.get('http://localhost:8000/api/classroom/limit/' + init + '/' + (init + 4), { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ listClassroom: response.data })
			)
		// console.log(Math.ceil(init / 4) + '>=' + Math.ceil((this.state.size) / 4));		
		changePage(Math.ceil(init / 4) >= Math.ceil(this.state.size / 4) ? Math.ceil(init / 4) : Math.ceil((init + 1) / 4));
	}
	//- - - - - - - - - - - - - - - -

	//METHODS LIFESPAN COMPONENT
	componentWillMount() {
		this.loadClassrooms();
	}

	componentWillUnmount() {
		this.source.cancel("cancel request");
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
				<Pagination id="page" className="justify-items"><this.createPagination /></Pagination>
				{/* Registrar salón */}
				<Modal className="modal-custom" show={this.state.showCreate} onHide={this.handleClose}>
					<AddClassroom handleCloseCreate={this.handleCloseCreate} handleClose={this.handleClose} />
				</Modal>
				{/* Editar salón */}
				<Modal className="modal-custom" show={this.state.showUpdate} onHide={this.handleClose}>
					<EditClassroom handleCloseUpdate={this.handleCloseUpdate} handleClose={this.handleClose} classroom={this.state.id} />
				</Modal>
				{/* Ver salón */}
				<Modal className="modal-custom" show={this.state.showView} onHide={this.handleClose}>
					<ViewClassroom handleClose={this.handleClose} classroom={this.state.id} />
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