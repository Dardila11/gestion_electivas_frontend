import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../../css/DashboardSecretary.css";
import NavBar from "../NavBar";
import Nav from "./NavSecretary";
import Footer from "../Footer";
import { closeSesion } from "../../js/handleLocalStorage";
import { URL } from "../../utils/URLServer";

export default class DashboardSecretary extends Component {
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
	token = JSON.parse(localStorage.getItem("token"));
	role = JSON.parse(localStorage.getItem("role"));
	constructor(props) {
		super(props);
		this.state = {
			isLogin: true,
			isNew: true
		};
	}

	verificar = () => {
		if (this.role !== null) {
			const role = parseInt(this.role);
			if (role === 3) {
				axios.post(URL + "api/verificate/", { "token": this.token }, { cancelToken: this.source.token, })
					.then(() => {
						this.setState({ isNew: false });
						axios.post(URL + "api/refresh/", { "token": this.token }, { cancelToken: this.source.token, })
							.then((response) => {
								localStorage.removeItem("token");
								localStorage.setItem("token", JSON.stringify(response.data.token));
							})
							.catch(() => {
								this.setState({ isLogin: false });
							});
					})
					.catch(() => {
						closeSesion();
						alert('Sesion expirada por inactividad');
						this.setState({ isLogin: false });
					});
			} else {
				closeSesion();
				alert('Sesion expirada por politicas de seguridad');
				this.setState({ isLogin: false });
			}
		} else {
			this.setState({ isLogin: false });
		}
	}

	mover = () => {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => { this.verificar() }, 900500);
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
		} else {
			return (
				<section className="hmi-100 app-main" onKeyPress={this.mover} onLoad={this.mover} onMouseMove={this.mover}>
					<NavBar />
					<Nav />
					<Footer></Footer>
				</section>
			)
		}
		return (<></>)
	}
}