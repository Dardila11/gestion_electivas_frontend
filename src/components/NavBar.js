import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Image, Button, Navbar, Form, FormControl } from "react-bootstrap";

import { show } from "../js/HandleDOM";

export default class NavBar extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
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
		this.setState({ redirect: true });
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/" />;
		}
		return (
			<Navbar>
				<Navbar.Brand>
					<Form.Check className="ocultar" name="show" id="boton-show" checked={this.state.show} onChange={this.handleChange} />
					<Form.Label className="mouse d-inline mr-2" htmlFor="boton-show"><Image src="../img/menu.png" alt="" /></Form.Label>
					<p className="d-inline m-0">SGE</p>
				</Navbar.Brand>
				<Form inline>
					<FormControl className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Search" />
					<Button className="btn btn-success my-2 my-sm-0" type="submit">Buscar</Button>
					<Button className="btn btn-danger my-2 my-sm-0 ml-1" type="button" onClick={this.onLogout}>Salir</Button>
				</Form>
			</Navbar>
		);
	}
}