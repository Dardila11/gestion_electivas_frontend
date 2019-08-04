import React, { Component } from "react";
import { Button, Table, Modal, Alert, Pagination } from "react-bootstrap";
import axios from "axios";

import { time, changePage } from "../../js/HandleDOM";
import VoteElective from '../elective/VoteElective';
import { URL } from "../../utils/URLServer";

import '../../css/Table.css';

export default class listEnrrollment extends Component {
	sizeBreak = 2;
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
	constructor(props, context) {
		super(props, context);
		this.state = {
			id: -1,
			size: 0,
			page: 0,
			listEnrrollment: [],
			showVote: false,
			showMessage: false
		};
		this.loadEnrrollments = this.loadEnrrollments.bind(this);
		this.createTableEnrrollments = this.createTableEnrrollments.bind(this);
	}

	handleClose = () => {
		this.setState({ showVote: false });
	}

	handleCloseVote = () => {
		this.setState({ showMessage: true, message: "Cambios guardados" });
		this.handleClose();
		time();
	}

	votar = (event) => {
		this.setState({ showVote: true, id: event.target.value });
	}

	//CREATE HTML
	createTableEnrrollments() {
		const listItems = [];
		const today = new Date();
		for (const enrrollment of this.state.listEnrrollment) {
			var buttonvote;
			const from_date = (new Date(this.state.listEnrrollment[0].course__from_date_vote));
			const to_date = (new Date(this.state.listEnrrollment[0].course__until_date_vote));
			if (today >= from_date && today <= to_date) {
				buttonvote = <Button className="btn mr-2 beige votar" onClick={this.votar} value={enrrollment.course__id}></Button>
			} else {
				buttonvote = <span>No disponible</span>
			}
			listItems.push(
				<tr key={enrrollment.id}>
					<td>{enrrollment.course__course_id}</td>
					<td>{enrrollment.course__course__name}</td>
					<td>{enrrollment.course__professor__first_name} {enrrollment.course__professor__last_name}</td>
					<td>{enrrollment.course__quota}</td>
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
		axios.get(URL + "api/enrrollment/limit/" + init + "/" + end + "/" + semester + "/" + username, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ listEnrrollment: response.data })
			)
	}

	async loadEnrrollments() {
		const semester = parseInt(localStorage.getItem("semester"));
		const username = localStorage.getItem("user").replace(/[""]+/g, "");
		console.log(username)
		var init = this.state.page;
		await axios.get(URL + "api/enrrollment/count/" + semester + "/" + username, { cancelToken: this.source.token, })
			.then(response =>
				this.setState({ size: response.data })
			)
		if (this.state.size > 0) {
			const initAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? (Math.ceil(this.state.size / this.sizeBreak) - 1) * this.sizeBreak : init;
			const endAux = Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? this.state.size : init + this.sizeBreak;
			await axios.get(URL + "api/enrrollment/limit/" + initAux + "/" + endAux + "/" + semester + "/" + username, { cancelToken: this.source.token, })
				.then((response) => {
					this.setState({ listEnrrollment: response.data })
				})
			changePage(Math.ceil(init / this.sizeBreak) >= Math.ceil(this.state.size / this.sizeBreak) ? Math.ceil(init / this.sizeBreak) : Math.ceil((init + 1) / this.sizeBreak), "pageEnrrollment");
		} else {
			await axios.get(URL + "api/enrrollment/limit/" + 0 + "/" + 0 + "/" + semester + "/" + username, { cancelToken: this.source.token, })
				.then(response =>
					this.setState({ listEnrrollment: response.data })
				)
		}
	}
	//- - - - - - - - - - - - - - - -

	//METHODS LIFESPAN COMPONENT
	componentWillMount() {
		this.loadEnrrollments();
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
							<th>Profesor</th>
							<th>Cupos</th>
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody className="table-autosize">
						<this.createTableEnrrollments />
					</tbody>
				</Table>
				<Pagination id="pageEnrrollment" className="justify-items"><this.createPagination /></Pagination>
				{/* Ver salón */}
				<Modal className="modal-custom" show={this.state.showVote} onHide={this.handleClose}>
					<VoteElective handleClose={this.handleClose} handleCloseVote={this.handleCloseVote} elective={this.state.id} />
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