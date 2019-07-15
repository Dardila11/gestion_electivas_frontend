import React, { Component } from 'react';
import {Image, Nav, Tab, Form, Container} from 'react-bootstrap';

import { hide } from '../js/index';
import ListClassroom from './ListClassroom';
import ListElective from './ListElective';
import ListStudent from './ListStudent';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({show: event.target.value});
        hide();
    }

    render() {
        return (
            <Tab.Container defaultActiveKey="2">
                <Nav className="flex-column ocultar" id="menu">
                    <div className="p-3 bb-1">
                        <Form.Check className="ocultar" name="boton-hide" id="boton-hide" checked={ this.state.show } onChange={ this.handleChange }/>
                        <Form.Label className="mouse d-inline mr-2" htmlFor="boton-hide"><Image src="../img/menu-1.png" alt=""/></Form.Label>
                        <p className="d-inline m-0">SGE</p>
                    </div>
                    <div className="p-3 bb-1 d-flex justify-content-center">
                        <div className="text-center">
                            <Image className="b-a p-1" src="../img/chica.png" roundedCircle />
                            <p className="mb-0">{ localStorage.getItem('user').replace(/['"]+/g, '') }</p>
                        </div>
                    </div>
                    <Nav.Link eventKey="1">Inicio</Nav.Link>
                    <Nav.Link eventKey="2">Salones</Nav.Link>
                    <Nav.Link eventKey="3">Electivas</Nav.Link>
                    <Nav.Link eventKey="4">Estudiantes</Nav.Link>
                </Nav>
                <Tab.Content>
                    <Container className="pl-5 pr-5">
                        <Tab.Pane eventKey="1"></Tab.Pane>
                        <Tab.Pane eventKey="2">
                            <ListClassroom/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="3">
                            <ListElective/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="4">
                            <ListStudent/>
                        </Tab.Pane>
                    </Container>
                </Tab.Content>
            </Tab.Container>
        )
    }
}