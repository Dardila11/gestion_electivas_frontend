import React, { Component } from 'react';
import { Button, Modal, Table, Form, FormControl } from 'react-bootstrap';
import axios from 'axios';
import AddStudent from './AddStudent';

export default class ListStudent extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			cvs_file: '',
			show: false,
			showUpload: false
		};
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

	handleShow = () => {
		this.setState({ show: true });
	}

	handleUpload = () => {
		this.setState({ showUpload: true });
	}

	subir = () => {
		console.log(this.state.cvs_file)
		this.setState({ showAlert: false });
		var json = {
			"cvs_file": this.state.cvs_file
		}
		let form_data = new FormData();
		form_data.append('csv_file', this.state.cvs_file[0], this.state.cvs_file[0].name);
		form_data.append('title', 'file');
		form_data.append('content', 'csv');
		axios.post("http://localhost:8000/api/file/", form_data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then(() => {
				// this.loadStudents()
			})
	}

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
							<th>#</th>
							<th>Código</th>
							<th>Nombres</th>
							<th>Apellidos</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>104613020476</td>
							<td>Miller Daniel</td>
							<td>Quilindo Velasco</td>
							<td>
								<Button className="btn mr-2 beige ver"></Button>
								<Button className="btn mr-2 beige editar"></Button>
								<Button className="btn beige borrar"></Button>
							</td>
						</tr>
					</tbody>
				</Table>
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
						<Button variant="primary" name="eliminar" onClick={this.subir}>Subir</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}