import React, { Component } from 'react';
import { Button, Modal, Table, Form, FormControl, Pagination } from 'react-bootstrap';
import axios from 'axios';
import AddStudent from './AddStudent';
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
			cvs_file: '',
			listStudents: [],
			show: false,
			showUpload: false
		};
		this.loadStudents = this.loadStudents.bind(this);
		this.createTableStudents = this.createTableStudents.bind(this);
	}

	handleChange = (event) => {
		console.log(event)
		const target = event.target;
		const value = target.type === "file" ? target.files : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	handleClose = () => {
		this.setState({ show: false, showUpload: false });
		this.loadStudents();
	}

	handleShow = () => {
		this.setState({ show: true });
	}

	handleUpload = () => {
		this.setState({ showUpload: true });
	}

	upload = () => {
		console.log(this.state.cvs_file)
		this.setState({ showAlert: false });
		let form_data = new FormData();
		form_data.append('csv_file', this.state.cvs_file[0], this.state.cvs_file[0].name);
		form_data.append('title', 'file');
		form_data.append('content', 'csv');
		axios.post("http://localhost:8000/api/file/", form_data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then((response) => {
				console.log(response);
				this.handleClose();
			})
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
						<Button className="btn beige borrar" name="eliminar" onClick={this.preguntar} value={student.studenet__id}></Button>
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
		return (
			<>
				<div className="title pt-4 mb-2">
					<h4 className="d-inline white">Gestionar estudiantes</h4>
					<Button className="d-inline float-right btn btn-light mb-2 ml-2 subir" onClick={this.handleUpload}></Button>
					<Button className="d-inline float-right btn btn-light mb-2 agregar" onClick={this.handleShow}></Button>
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
					<tbody  className="table-autosize">
						<this.createTableStudents />
					</tbody>
				</Table>
				<Pagination id="pageStudent" className="justify-items"><this.createPagination /></Pagination>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Registrar estudiante</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<AddStudent />
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
					</Modal.Footer>
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
			</>
		);
	}
}