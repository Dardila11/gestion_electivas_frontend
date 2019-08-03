import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../../css/DashboardSecretary.css";
import NavBar from "../NavBar";
import Nav from "./NavStudent";

export default class DashboardStudent extends Component {
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
	token = JSON.parse(localStorage.getItem("token"));
	constructor(props) {
		super(props);
		this.state = {
			isLogin: true,
			isNew: true
		};
	}

	verificar = () => {
		axios.post("http://localhost:8000/api/verificate/", { "token": this.token }, { cancelToken: this.source.token, })
			.then(() => {
				this.setState({ isNew: false });
				axios.post("http://localhost:8000/api/refresh/", { "token": this.token }, { cancelToken: this.source.token, })
					.then((response) => {
						localStorage.removeItem("token");
						localStorage.setItem("token", JSON.stringify(response.data.token));
					})
					.catch(() => {
						this.setState({ isLogin: false });
					});
			})
			.catch(() => {
				alert('Sesion expirada por inactividad');
				this.setState({ isLogin: false });
			});
	}

	mover = () => {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => { this.verificar() }, 901000);
	}

	componentWillMount() {
		this.verificar();
	}

	componentWillUnmount() {
		this.source.cancel("cancel request");
	}

	render() {
		if (!this.state.isLogin) {
			return <Redirect to="/" />;
		} else if (!this.state.isNew) {
			return (
				<section className="hmi-100 app-main" onKeyPress={this.mover} onPointerEnter={this.mover} onMouseMove={this.mover}>
					<NavBar />
					<Nav />
				</section>
			)
		}
		return (<></>)
	}
}