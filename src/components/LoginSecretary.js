import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import logo from '../img/logoU.png';
import '../css/LoginSecretary.css';
import { time } from '../js/HandleDOM';

export default class LoginSecretary extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            username: "anita",
            password: "oracle",
            redirect: false,
            message: "",
            show: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.redirect = this.redirect.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    redirect(response) {
        localStorage.setItem("user", JSON.stringify(response.data.user.username));
        localStorage.setItem("token", JSON.stringify(response.data.token));
        this.setState({ show: false, redirect: true });
    }

    onLogin(event) {
        event.preventDefault();
        const { username, password } = this.state;        
        axios.post("http://localhost:8000/api/login/", { username, password }, { cancelToken: this.source.token, })
            .then(response => this.redirect(response))
            .catch(error => {
                this.setState({ message: error.response.data.error, show: true });
                time();
            });
    }

    componentWillMount() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
    }

    componentWillUnmount() {
        this.source.cancel("cancel request");
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/dashboard" />;
        }
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <div className="app-secretary">
                    <div className="center">
                        <header className="app-header">
                            <img src={logo} alt="logo" />
                        </header>
                        <div className="caja">
                            <Form onSubmit={this.onLogin}>
                                <Form.Label><h3>Iniciar Sesión</h3></Form.Label>
                                <Form.Control className="mb-2" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Usuario" required />
                                <Form.Control className="mb-2" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Contraseña" required />
                                <Button variant="primary" type="submit">Ingresar</Button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="no-login time">
                    <Alert variant="danger" show={this.state.show} onClose={handleDismiss} dismissible>
                        <p className="mb-0">{this.state.message}</p>
                    </Alert>
                </div>
            </>
        )
    }
}