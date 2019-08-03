import React, { Component } from "react";
import { Button, Table, Modal, Alert, Pagination } from "react-bootstrap";
import axios from "axios";

import { time, changePage } from "../../js/HandleDOM";
import EditElective from './EditElective';

import '../../css/Table.css';

export default class listElectives extends Component {
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
			showEdit: false,
			showMessage: false
		};
		this.loadElectives = this.loadElectives.bind(this);
		this.createTableElectives = this.createTableElectives.bind(this);
	}

	handleClose = () => {
		this.setState({ showEdit: false });
	}

	handleCloseVote = () => {
		this.setState({ showMessage: true, message: "Cambios guardados" });
		this.handleClose();
		time();
	}

	votar = (event) => {
		console.log(event.target.value)
		this.setState({ showEdit: true, id: event.target.value, showMessage: false });
	}

	//CREATE HTML
	createTableElectives() {
		const listItems = [];
		const today = new Date();
		for (const enrrollment of this.state.listElectives) {
			var buttonvote;
			const from_date = (new Date(this.state.listElectives[0].from_date_vote));
			console.log(from_date)
			if (today < from_date) {
				buttonvote = <Button className="btn mr-2 beige editar" onClick={this.votar} value={enrrollment.id}></Button>
			} else {
				buttonvote = <span>Vencida</span>
			}
			listItems.push(
				<tr key={enrrollment.id}>
					<td>{enrrollment.course__course_id}</td>
					<td>{enrrollment.course__name}</td>
					<td>{enrrollment.quota}</td>
					<td>
						<div className="d-flex">
							{buttonvote}
						</div>
					</td>
				</tr>
			);
		}
		return listItems;
	}

	createPagination = () => {
		let items = [];
		for (let number = 1; number <= Math.ceil(this.state.size / this.sizeBreak); number++) {
			items.push(
				<Pagination.Item key={number} name={number} onClick={this.changeEnrrollments}>
					{number}
				</Pagination.Item>,
			);
		}
		return items;
	}
	//- - - - - - - - - - - - - - - -

	//LOAD DATA
	changeEnrrollments = (event) => {
		const semester = parseInt(localStorage.getItem("semester"));
		const username = localStorage.getItem("user").replace(/[""]+/g, "");
		const init = (parseInt(event.target.name) - 1) * this.sizeBreak;
		const end = parseInt(event.target.name) * this.sizeBreak;
		changePage(parseInt(event.target.name), "pageEnrrollment");
		this.setState({ page: init });
		axios.get("http://localhost:8000/api/course/professor/limit/" + init + "/" + end + "/" + semester + "/" + username, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ listElectives: response.data })
			)
	}

	async loadElectives() {
		const semester = parseInt(localStorage.getItem("semester"));
		const username = localStorage.getItem("user").replace(/[""]+/g, "");
		console.log(username)
		var init = this.state.page;
		await axios.get("http://localhost:8000/api/course/professor/count/" + semester + "/" + username, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ size: response.data })
			)
		if (this.state.size > 0) {
			const initAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? (Math.ceil(this.state.size / this.sizeBreak) - 1) * this.sizeBreak : init;
			const endAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? this.state.size : init + this.sizeBreak;
			await axios.get("http://localhost:8000/api/course/professor/limit/" + initAux + "/" + endAux + "/" + semester + "/" + username, { cancelToken: this.source.token, })
				.then((response) => {
					this.setState({ listElectives: response.data })
				})
			changePage(Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? Math.ceil(init / this.sizeBreak) : Math.ceil((init + 1) / this.sizeBreak), "pageEnrrollment");
		} else {
			await axios.get("http://localhost:8000/api/course/professor/limit/" + 0 + "/" + 0 + "/" + semester + "/" + username, { cancelToken: this.source.token, })
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
					<h4 className="d-inline white h-100">Electivas matriculadas</h4>
				</div>
				<Table striped bordered responsive="xl" size="xl">
					<thead>
						<tr>
							<th>Código</th>
							<th>Nombre</th>
							<th>Cupos</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody className="table-autosize">
						<this.createTableElectives />
					</tbody>
				</Table>
				<Pagination id="pageEnrrollment" className="justify-items"><this.createPagination /></Pagination>
				{/* Ver salón */}
				<Modal className="modal-custom" show={this.state.showEdit} onHide={this.handleClose}>
					<EditElective handleClose={this.handleClose} handleCloseUpdate={this.handleCloseVote} elective={this.state.id} />
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