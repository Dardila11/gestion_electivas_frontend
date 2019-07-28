import React, { Component } from 'react';
import { Button, Table, Modal, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';

import { time, changePage } from "../../js/HandleDOM";
import AddElective from './AddElective';
import EditElective from './EditElective';
import ViewElective from './ViewElective';

import '../../css/Table.css';

export default class ListElective extends Component {
	sizeBreak = 2;
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: -1,
			size: 0,
			page: 0,
			listElectives: [],
			showCreate: false,
			showUpdate: false,
			showView: false,
			showAlert: false,
			showMessage: false
		};
		this.loadElectives = this.loadElectives.bind(this);
		this.createTableElectives = this.createTableElectives.bind(this);
	}

	handleClose = () => {
		this.setState({ showAlert: false, showCreate: false, showUpdate: false, showView: false });
		this.loadElectives();
	}

	handleShow = () => {
		this.setState({ show: true });
	}

	handleCloseCreate = () => {
		this.setState({ showMessage: true, message: "Electiva creada" });
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

	editar = (event) => {
		this.setState({ showUpdate: true, id: event.target.value });
	}

	ver = (event) => {
		this.setState({ showView: true, id: event.target.value });
	}

	eliminar = (event) => {
		this.setState({ showAlert: false });
		axios.delete("http://localhost:8000/api/course/delete/" + this.state.id)
			.then(() => {
				this.loadElectives()
			})
	}

	preguntar = (event) => {
		console.log(event.currentTarget.value)
		if (event.currentTarget.name === "eliminar") {
			this.setState({ id: event.currentTarget.value, showAlert: true });
		}
	}

	//CREATE HTML
	createTableElectives() {
		const listItems = this.state.listElectives.map((elective) =>
			<tr key={elective.id}>
				<td>{elective.course__course_id}</td>
				<td>{elective.course__name}</td>
				<td>{elective.professor__first_name} {elective.professor__last_name}</td>
				<td>
					<div className="d-flex">
						<Button className="btn mr-2 beige ver" onClick={this.ver} value={elective.id}></Button>
						<Button className="btn mr-2 beige editar" onClick={this.editar} value={elective.id}></Button>
						<Button className="btn beige borrar" name="eliminar" onClick={this.preguntar} value={elective.id}></Button>
					</div>
				</td>
			</tr>
		);
		return listItems;
	}

	createPagination = () => {
		let items = [];
		for (let number = 1; number <= Math.ceil(this.state.size / this.sizeBreak); number++) {
			items.push(
				<Pagination.Item key={number} name={number} onClick={this.changeElectives}>
					{number}
				</Pagination.Item>,
			);
		}
		return items;
	}
	//- - - - - - - - - - - - - - - -

	//LOAD DATA
	changeElectives = (event) => {
		const semester = parseInt(localStorage.getItem("semester"));
		const init = (parseInt(event.target.name) - 1) * this.sizeBreak;
		const end = parseInt(event.target.name) * this.sizeBreak;
		changePage(parseInt(event.target.name), "pageElectives");
		this.setState({ page: init });
		axios.get("http://localhost:8000/api/course/limit/" + init + "/" + end + "/" + semester, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ listElectives: response.data })
			)
	}

	async loadElectives() {
		const semester = parseInt(localStorage.getItem("semester"));
		const init = this.state.page;
		await axios.get("http://localhost:8000/api/course/count/" + semester, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ size: response.data })
			)
		if (this.state.size > 0) {
			const initAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? (Math.ceil(this.state.size / this.sizeBreak) - 1) * this.sizeBreak : init;
			const endAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? this.state.size : init + this.sizeBreak;
			await axios.get("http://localhost:8000/api/course/limit/" + initAux + "/" + endAux + "/" + semester, { cancelToken: this.source.token, })
				.then((response) => {
					this.setState({ listElectives: response.data })
				})
			changePage(Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? Math.ceil(init / this.sizeBreak) : Math.ceil((init + 1) / this.sizeBreak), "pageElectives");
		} else {
			await axios.get("http://localhost:8000/api/course/limit/" + 0 + "/" + 0 + "/" + semester, { cancelToken: this.source.token, })
				.then(response =>
					this.setState({ listElectives: response.data })
				)
		}
	}
	//- - - - - - - - - - - - - - - -

	//METHODS LIFESPAN COMPONENT
	componentWillMount() {
		this.loadElectives();
	}

	componentWillUnmount() {
		this.source.cancel("cancel request");
	}
	//- - - - - - - - - - - - - - - -

	render() {
		const handleDismiss = () => this.setState({ showMessage: false });
		return (
			<>
				<div className="title pt-4 mb-2">
					<h4 className="d-inline white">Gestionar electivas</h4>
					<Button className="d-inline float-right btn btn-light mb-2 agregar" onClick={this.create}></Button>
				</div>
				<Table striped bordered hover responsive="xl" size="xl">
					<thead>
						<tr>
							<th>Código</th>
							<th>Nombre</th>
							<th>Profesor</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody className="table-autosize">
						<this.createTableElectives />
					</tbody>
				</Table>
				<Pagination id="pageElectives" className="justify-items"><this.createPagination /></Pagination>
				{/* Registrar salón */}
				<Modal className="modal-custom" show={this.state.showCreate} onHide={this.handleClose}>
					<AddElective handleCloseCreate={this.handleCloseCreate} handleClose={this.handleClose} />
				</Modal>
				{/* Editar salón */}
				<Modal className="modal-custom" show={this.state.showUpdate} onHide={this.handleClose}>
					<EditElective handleCloseUpdate={this.handleCloseUpdate} handleClose={this.handleClose} elective={this.state.id} />
				</Modal>
				{/* Ver salón */}
				<Modal className="modal-custom" show={this.state.showView} onHide={this.handleClose}>
					<ViewElective handleClose={this.handleClose} elective={this.state.id} />
				</Modal>
				{/* Eliminar salón */}
				{/* Eliminar salón */}
				<Modal show={this.state.showAlert} onHide={this.handleClose}>
					<Modal.Body>
						<span>¿Seguro desea eliminar la electiva?</span>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
						<Button variant="primary" name="eliminar" onClick={this.eliminar}>Aceptar</Button>
					</Modal.Footer>
				</Modal>
				<div className="no-login time">
					<Alert variant="success" show={this.state.showMessage} onClose={handleDismiss} dismissible>
						<p className="mb-0">{this.state.message}</p>
					</Alert>
				</div>
			</>
		);
	}
}