import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";

import logo from "../img/logoU.png";
import "../css/LoginSecretary.css";
import { time } from "../js/HandleDOM";
import { URL } from "../utils/URLServer"

export default class LoginSecretary extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            username: "anita",
            password: "oracle",
            dashboardSecretary: false,
            dashboardStudent: false,
            dashboardProfessor: false,
            semester: false,
            message: "",
            show: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSemester = (data, role) => {
        if (role === 3) {
            if (data.length > 0) {
                const now = new Date();
                const date = new Date(data[data.length - 1].fields.until_date);
                if (now > date) {
                    this.setState({ semester: true });
                } else {
                    localStorage.setItem("semester", data[data.length - 1].pk);
                    this.setState({ dashboardSecretary: true });
                }
            } else {
                this.setState({ semester: true });
            }
        } else if (role === 1) {
            if (data.length > 0) {
                const now = new Date();
                const date = new Date(data[data.length - 1].fields.until_date);
                if (now > date) {
                    this.setState({ message: "No hay un semestre en curso", show: true });
                    time();
                } else {
                    localStorage.setItem("semester", data[data.length - 1].pk);
                    this.setState({ dashboardStudent: true });
                }
            } else {
                this.setState({ message: "No hay semestres registrados", show: true });
                time();
            }
        } else if (role === 2) {
            if (data.length > 0) {
                const now = new Date();
                const date = new Date(data[data.length - 1].fields.until_date);
                if (now > date) {
                    this.setState({ message: "No hay un semestre en curso", show: true });
                    time();
                } else {
                    localStorage.setItem("semester", data[data.length - 1].pk);
                    this.setState({ dashboardProfessor: true });
                }
            } else {
                this.setState({ message: "No hay semestres registrados", show: true });
                time();
            }
        } else {
            this.setState({ message: "Usuario sin permisos", show: true });
            time();
        }
    }


    redirect = (data) => {
        localStorage.setItem("user", JSON.stringify(data.user.username));
        localStorage.setItem("token", JSON.stringify(data.token));
        const role = data.user.groups[0];
        console.log(role)
        localStorage.setItem("role", JSON.stringify(role));
        axios.get(URL + "api/semester/", { "token": this.token }, { cancelToken: this.source.token, })
            .then((response) => {
                this.handleSemester(response.data, role);
            })

    }

    onLogin(event) {
        event.preventDefault();
        const { username, password } = this.state;
        axios.post(URL + "api/login/", { username, password }, { cancelToken: this.source.token, })
            .then(response => {
                this.redirect(response.data)
            })
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
        if (this.state.dashboardSecretary) {
            return <Redirect to="/dashboard/secretary" />;
        }
        else if (this.state.dashboardStudent) {
            return <Redirect to="/dashboard/student" />;
        }
        else if (this.state.dashboardProfessor) {
            return <Redirect to="/dashboard/professor" />;
        }
        else if (this.state.semester) {
            return <Redirect to="/semester" />
        }
        const handleDismiss = () => this.setState({ show: false });
        return (
            <>
                <div className="app-secretary">
                    <div className="center">
                        <header className="app-header">
                            <img src={logo} alt="logo" />
                        </header>
                        <div className="content-caja d-flex justify-content-center">
                            <div className="caja">
                                <Form onSubmit={this.onLogin}>
                                    <div className="justify-content-center d-flex">
                                        <div className="logo-sge"></div>
                                    </div>
                                    <span className="SGE">SGE</span><br />
                                    <Form.Label className="mb-0"><h3 className="title-login mt-2">Iniciar Sesión</h3></Form.Label>
                                    <Form.Control className="mb-2" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Usuario" required />
                                    <Form.Control className="mb-2" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Contraseña" required />
                                    <Button variant="primary" type="submit">Ingresar</Button>
                                </Form>
                            </div>
                        </div>
                        <div className="footer-login p-3">
                            <span>2019 | División de las Tecnologías de la Información y las Comunicaciones</span><br />
                            <span>Universidad del Cauca | sgeunicauca@gmail.com</span> <br />
                            <span>Version 1.0</span>
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