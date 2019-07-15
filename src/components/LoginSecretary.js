import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import logo from '../img/logoU.png';
import '../css/LoginSecretary.css';

class LoginSecretary extends Component {
    constructor(props, context) {
        super(props, context);        
        this.state = {
            username: 'anita', 
            password: 'oracle', 
            redirect: false, 
            error: false, 
            show: true
        };        
        this.handleChange = this.handleChange.bind(this);
        this.redirect = this.redirect.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    handleChange(event) {
        console.log('event');
        this.setState({ [event.target.name]: event.target.value });
    }

    redirect(response) {
        localStorage.setItem('user', JSON.stringify(response.data.user.username));
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.setState({ redirect: true });
        //this.setState({ error: false });
    }

    onLogin(event) {
        const { username, password } = this.state;
        event.preventDefault();
        axios.post('http://localhost:8000/api/login/', { username, password }, { cancelToken: this.source.token,})
        .then(response => this.redirect(response))
        .catch(error => {
            this.setState({ error: true });
        });
    }

    componentWillMount() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.source.cancel('cancel request');
    }

    render() {  
        if (this.state.redirect) {
            return <Redirect to='/dashboard'/>;
        }
        const handleDismiss = () => this.setState({ show: false }); 
        const handleShow = () => this.setState({ show: true });     
        return (
            <div className="app-secretary">
                <div className="center">
                    <header className="app-header">
                        <img src={logo} alt="logo" />
                    </header>
                    <div className="caja">
                        <Form onSubmit={ this.onLogin }>
                            <Form.Label><h3>Iniciar Sesión</h3></Form.Label>
                            <Form.Control className="mb-2" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Usuario" />
                            <Form.Control className="mb-2" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Contraseña" />                             
                            <Button onClick={ handleShow } variant="primary" type="submit">Ingresar</Button>
                        </Form>                        
                    </div> 
                    <div className="no-login">
                        <Alert variant="danger" show={ this.state.show && this.state.error } onClose={ handleDismiss } dismissible>
                            <p>Autenticacion fallida</p>
                        </Alert>
                    </div>                   
                </div>   
            </div>
        )
    }
}

export default LoginSecretary;