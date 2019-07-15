import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {Image, InputGroup, Button, Nav, Tab, Form, Col, Row, Container} from 'react-bootstrap';

import ListClassroom from './ListClassroom';
import ListElective from './ListElective';
import ListStudent from './ListStudent';

export default class NavBar extends Component {
    render() {
        return (
            <Tab.Container defaultActiveKey="2">
                <Nav className="flex-column" id="menu">
                    <div className="p-3 bb-1">
                        <InputGroup.Checkbox name="boton-hide" id="boton-hide"/>
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
                    <Nav.Link eventKey="4">Estudiante</Nav.Link>
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