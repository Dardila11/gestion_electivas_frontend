import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Image, Button, Navbar, Form } from "react-bootstrap";
import axios from 'axios';

import { show, hide } from "../js/HandleDOM";
import { URL } from "../utils/URLServer"

export default class NavBar extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			semester: "",
			redirect: false,
			show: true,
		};
		this.handleChange = this.handleChange.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
		if (event.target.name === "show") {
			show();
		}
	}

	onLogout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("semester");
		localStorage.removeItem("role");
		this.setState({ redirect: true });
	}

	componentWillMount() {
		hide();
		const semester = parseInt(localStorage.getItem("semester"));
		if (localStorage.getItem("semester") !== null) {
			axios.get(URL + "api/semester/" + semester, { "token": this.token })
				.then((response) => {
					this.setState({ semester: " " + response.data[0].year + "." + response.data[0].period })
				})
		}
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/" />;
		}
		return (
			<Navbar>
				<Navbar.Brand>
					<Form.Check className="ocultar" name="show" id="boton-show" checked={this.state.show} onChange={this.handleChange} />
					<Form.Label className="mouse d-inline mr-2" htmlFor="boton-show"><Image src="../../img/menu.png" alt="" /></Form.Label>
					<p className="d-inline m-0">SGE {this.state.semester}</p>
				</Navbar.Brand>
				<Form inline>
					<Button className="btn btn-danger my-2 my-sm-0 ml-1" type="button" onClick={this.onLogout}>Salir</Button>
				</Form>
			</Navbar>
		);
	}
}