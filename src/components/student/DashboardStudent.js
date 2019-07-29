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

	componentWillMount() {
		console.log( localStorage.getItem("semester") );
		axios.post("http://localhost:8000/api/verificate/", { "token": this.token }, { cancelToken: this.source.token, })
			.then(() => {
				this.setState({ isNew: false });
			})
			.catch(() => {
				this.setState({ isLogin: false });
			});
	}

	componentWillUnmount() {
		this.source.cancel("cancel request");
	}

	render() {
		if (!this.state.isLogin) {
			return <Redirect to="/" />;
		} else if (!this.state.isNew) {
			return (
				<div className="hmi-100 app-main">
					<NavBar />
					<Nav />
				</div>
			)
		}
		return (<></>)
	}
}