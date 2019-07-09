import React, { Component } from 'react';
import logo from '../img/logoU.png';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import axios from 'axios';
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
        this.onLogin = this.onLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    redirect(response) {
        localStorage.setItem('user', JSON.stringify(response.data.user.username));
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.setState({ redirect: true });
        this.setState({ error: false });
    }

    onLogin(event) {
        const CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        const { username, password } = this.state;
        event.preventDefault();
        axios.post('http://localhost:8000/api/login/', { username, password }, { cancelToken: source.token,})
        .then(response => this.redirect(response))
        .catch(error => {
            this.setState({ error: true });
        });
    }

    componentWillMount() {
        console.log('call create')
    }

    componentWillUnmount() {
        console.log('call destroy')
    }

    render() {  
        if (this.state.redirect) {
            return <Redirect to='/workspace'/>;
        }
        const handleDismiss = () => this.setState({ show: false }); 
        const handleShow = () => this.setState({ show: true });     
        return (
            <div className="app-secretary">
                <div className="center">
                    <header className="App-header">
                        <img src={logo} alt="logo" />
                    </header>
                    <div className="Caja">
                        <Form onSubmit={ this.onLogin }>
                            <Form.Label><h3>Iniciar Sesión</h3></Form.Label>
                            <Form.Control type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Usuario" />
                            <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Contraseña" />                             
                            <Button onClick={ handleShow } variant="primary" type="submit">Ingresar</Button>
                        </Form>                        
                    </div> 
                    <div className="no-login">
                        <Alert variant="danger" show={ this.state.show && this.state.error } onClose={ handleDismiss } dismissible>
                            <p>Autenticacion fallida</p>
                        </Alert>
                    </div>                   
                </div>
                <div className="Antorcha"></div>
                <div className="Bandera"></div>                
            </div>
        )
    }
}

export default LoginSecretary;