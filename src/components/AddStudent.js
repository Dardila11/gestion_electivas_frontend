import React, {Component} from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import '../css/Table.css';

export default class AddStudent extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            classRoom_id: "101",
            capacity: "20",
            description: "nuevo salon",
            faculty: 1
        };
        this.newClassroom = this.newClassroom.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: [event.target.value]})
    }

    newClassroom(event) {
        const {classRoom_id, capacity, description, faculty } = this.state;
        var json = { "classroom_id": classRoom_id,
        "capacity": capacity,
        "description": description,
        "faculty": faculty }
        event.preventDefault();
        
        axios.post('http://localhost:8000/api/classroom/', json)
            .then(function(respone){
                console.log(respone);
        });
    }
    
    render() {
        return(
            /* TODO: Falta arreglar el espacio que deja vacio */
            <div className="container-fluid">
                <Form onSubmit={this.newClassroom}>
                    <Row className="mb-3">
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                        <Form.Group>
                            <Form.Label><span className="ml-0">Código</span></Form.Label>
                            <Form.Control className="ml-0" type="text" name="classRoom_id" value={this.state.classRoom_id} onChange={this.handleChange}/>
                        </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                        <Form.Group>
                            <Form.Label><span className="ml-0">Correo</span></Form.Label>
                            <Form.Control className="ml-0" type="email"></Form.Control>
                        </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                        <Form.Group>
                            <Form.Label><span className="ml-0">Nombres</span></Form.Label>
                            <Form.Control className="ml-0" type="text" name="capacity" value={this.state.capacity} onChange={this.handleChange} />
                        </Form.Group>
                        </Col>
                        <Col className="col-sm-6 col-xl-6 col-lg-6">
                        <Form.Group>
                            <Form.Label><span className="ml-0">Apellidos</span></Form.Label>
                            <Form.Control className="ml-0" type="text"></Form.Control>
                        </Form.Group>
                        </Col>                        
                    </Row>
                    <Button className="rounded-10" variant="primary" type="submit">Registrar</Button>
                </Form>
            </div>
        );
    }
}