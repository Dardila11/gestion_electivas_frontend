import React, { Component } from 'react';
import { Button, Modal, Table, Form, FormControl, Pagination, Alert } from 'react-bootstrap';
import axios from 'axios';
import AddStudent from './AddStudent';
import UpdateStudent from './EditStudent';
import ViewStudent from './ViewStudent';
import { time, changePage } from "../../js/HandleDOM";

export default class ListStudent extends Component {
	sizeBreak = 2;
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
	constructor(props, context) {
		super(props, context);
		this.state = {
			size: 0,
			page: 0,
			cvs_file: [],
			listStudents: [],
			showCreate: false,
			showUpdate: false,
			showUpload: false,
			showAlert: false,
			showMessage: false,
			typeMessage: "",
		};
		this.loadStudents = this.loadStudents.bind(this);
		this.createTableStudents = this.createTableStudents.bind(this);
	}

	handleChange = (event) => {
		const target = event.target;
		const value = target.type === "file" ? target.files : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	handleClose = () => {
		this.setState({ showCreate: false, showUpdate: false, showView: false, showUpload: false, showAlert: false });
		this.loadStudents();
	}

	handleCloseCreate = () => {
		this.setState({ typeMessage: "success", showMessage: true, message: "Electiva creada" });
		this.handleClose();
		time();
	}

	handleCloseUpdate = () => {
		this.setState({ typeMessage: "success", showMessage: true, message: "Cambios guardados" });
		this.handleClose();
		time();
	}

	handleUpload = () => {
		this.setState({ showUpload: true });
	}

	upload = () => {
		if (this.state.cvs_file.length > 0) {
			const semester = parseInt(localStorage.getItem("semester"));
			this.setState({ showAlert: false });
			let form_data = new FormData();
			form_data.append('csv_file', this.state.cvs_file[0], this.state.cvs_file[0].name);
			form_data.append('title', 'file');
			form_data.append('content', 'csv');
			form_data.append('semester', semester);
			axios.post("http://localhost:8000/api/file/", form_data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
				.then((response) => {
					this.setState({ typeMessage: "success", showMessage: true, message: response.data });
					this.handleClose();
				})
				.catch(error => console.log(error))
			this.setState({ cvs_file: [] });
		} else {
			console.log('error');
			this.setState({ typeMessage: "danger", showMessage: true, message: "Seleccione un archivo" });
			time();
		}
	}

	crear = () => {
		this.setState({ showCreate: true });
	}

	editar = (event) => {
		this.setState({ showUpdate: true, id: event.target.value });
	}

	eliminar = () => {
		this.setState({ showAlert: false });
		axios.delete("http://localhost:8000/api/student/delete/" + this.state.id)
			.then(() => {
				this.loadStudents()
			})
	}

	ver = (event) => {
		this.setState({ showView: true, id: event.target.value });
	}

	preguntar = (event) => {
		if (event.currentTarget.name === "eliminar") {
			this.setState({ id: event.currentTarget.value, showAlert: true });
		}
	}

	//CREATE HTML
	createTableStudents() {
		const listItems = this.state.listStudents.map((student) =>
			<tr key={student.student__id}>
				<td>{student.student__user_id}</td>
				<td>{student.student__first_name}</td>
				<td>{student.student__last_name}</td>
				<td>
					<div className="d-flex">
						<Button className="btn mr-2 beige ver" onClick={this.ver} value={student.student__id}></Button>
						<Button className="btn mr-2 beige editar" onClick={this.editar} value={student.student__id}></Button>
						<Button className="btn beige borrar" name="eliminar" onClick={this.preguntar} value={student.student__id}></Button>
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
				<Pagination.Item key={number} name={number} onClick={this.changeStudents}>
					{number}
				</Pagination.Item>,
			);
		}
		return items;
	}
	//- - - - - - - - - - - - - - - -

	//LOAD DATA
	changeStudents = (event) => {
		const semester = parseInt(localStorage.getItem("semester"));
		const init = (parseInt(event.target.name) - 1) * this.sizeBreak;
		const end = parseInt(event.target.name) * this.sizeBreak;
		changePage(parseInt(event.target.name), "pageStudent");
		this.setState({ page: init });
		axios.get("http://localhost:8000/api/student/limit/" + init + "/" + end + "/" + semester, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ listStudents: response.data })
			)
	}

	async loadStudents() {
		const semester = parseInt(localStorage.getItem("semester"));
		var init = this.state.page;
		await axios.get("http://localhost:8000/api/student/count/" + semester, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ size: response.data })
			)
		if (this.state.size > 0) {
			const initAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? (Math.ceil(this.state.size / this.sizeBreak) - 1) * this.sizeBreak : init;
			const endAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? this.state.size : init + this.sizeBreak;
			await axios.get("http://localhost:8000/api/student/limit/" + initAux + "/" + endAux + "/" + semester, { cancelToken: this.source.token, })
				.then((response) => {
					this.setState({ listStudents: response.data })
				})
			changePage(Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? Math.ceil(init / this.sizeBreak) : Math.ceil((init + 1) / this.sizeBreak), "pageStudent");
		} else {
			await axios.get("http://localhost:8000/api/student/limit/" + 0 + "/" + 0 + "/" + semester, { cancelToken: this.source.token, })
				.then(response =>
					this.setState({ listStudents: response.data })
				)
		}
	}
	//- - - - - - - - - - - - - - - -

	//METHODS LIFESPAN COMPONENT
	componentWillMount() {
		this.loadStudents();
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
					<h4 className="d-inline white">Gestionar estudiantes</h4>
					<Button className="d-inline float-right btn btn-light mb-2 ml-2 subir" onClick={this.handleUpload}></Button>
					<Button className="d-inline float-right btn btn-light mb-2 agregar" onClick={this.crear}></Button>
				</div>
				<Table striped bordered hover responsive="xl" size="xl">
					<thead>
						<tr>
							<th>Código</th>
							<th>Nombres</th>
							<th>Apellidos</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody className="table-autosize">
						<this.createTableStudents />
					</tbody>
				</Table>
				<Pagination id="pageStudent" className="justify-items"><this.createPagination /></Pagination>
				{/* Create student */}
				<Modal className="modal-custom" show={this.state.showCreate} onHide={this.handleClose}>
					<AddStudent handleCloseCreate={this.handleCloseCreate} handleClose={this.handleClose} />
				</Modal>
				{/* Update student */}
				<Modal className="modal-custom" show={this.state.showUpdate} onHide={this.handleClose}>
					<UpdateStudent handleCloseUpdate={this.handleCloseUpdate} handleClose={this.handleClose} student={this.state.id} />
				</Modal>
				{/* Ver salón */}
				<Modal className="modal-custom" show={this.state.showView} onHide={this.handleClose}>
					<ViewStudent handleClose={this.handleClose} student={this.state.id} />
				</Modal>
				{/* Upload students */}
				<Modal show={this.state.showUpload} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Cargar reporte estudiantes</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<FormControl name="cvs_file" type="file" ref={this.state.file} onChange={this.handleChange}></FormControl>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
						<Button variant="primary" name="eliminar" onClick={this.upload}>Subir</Button>
					</Modal.Footer>
				</Modal>
				{/* Eliminar salón */}
				<Modal show={this.state.showAlert} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>¿Seguro desea eliminar el estudiante?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<span>Eliminará todas las matriculas asociadas al estudiante</span>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
						<Button variant="primary" name="eliminar" onClick={this.eliminar}>Aceptar</Button>
					</Modal.Footer>
				</Modal>
				<div className="no-login time">
					<Alert variant={this.state.typeMessage} show={this.state.showMessage} onClose={handleDismiss} dismissible>
						<p className="mb-0">{this.state.message}</p>
					</Alert>
				</div>
			</>
		);
	}
}