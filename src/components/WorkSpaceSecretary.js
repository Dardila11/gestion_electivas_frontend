import React, { Component } from 'react';
import { ListGroup, Nav } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import "react-bootstrap/dist/react-bootstrap.min.js";
import '../css/WorkSpaceSecretary.css';
import axios from 'axios';

class WorkSpaceSecretary extends Component {
    constructor(props, context) {
        super(props, context);
        const user = JSON.parse(localStorage.getItem('user'));
        this.state = {
          user: user
        };
    }
    componentWillMount() {
        const token = JSON.parse(localStorage.getItem('token'));
        axios.post('http://localhost:8000/api/verificate/', { "token": token })
        .catch(error => {
            this.setState({ user: "" });
        });
    }
    
    render() {
        if (this.state.user) {
            return (
                <div className="Root__top-container">
                    <div className="Root__nav-bar">
                        <ListGroup activeKey="/home">
                            <ListGroup.Item><Nav.Link href="/workspace/">Inicio</Nav.Link></ListGroup.Item>
                            <ListGroup.Item>Salones</ListGroup.Item>
                            <ListGroup.Item>Electivas</ListGroup.Item>
                            <ListGroup.Item>Estudiantes</ListGroup.Item>
                            <ListGroup.Item>Configuracion</ListGroup.Item>
                            <ListGroup.Item><Nav.Link href="/">Salir</Nav.Link></ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className="Root__main-view">
                        {/* <Classroom /> */}
                    </div>
                </div>
            )
        }
        return <Redirect to='/'/>;
    }
}

export default WorkSpaceSecretary;  