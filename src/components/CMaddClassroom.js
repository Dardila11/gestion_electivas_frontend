import React, {Component} from 'react';
import { Form, Button, Navbar } from 'react-bootstrap';
import axios from 'axios';

class CMaddClassroom extends Component {
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
    handleChange(event){
        this.setState({ [event.target.name]: [event.target.value]})
    }
    newClassroom(event){
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
    render(){
        return(
            /* TODO: Falta arreglar el espacio que deja vacio */
            <div className="card align-top">
                <span className="h4 align-self-auto card-header">GESTIONAR SALONES</span>
                    <Navbar bg="light" expand="lg">
                        <Form inline onSubmit={this.newClassroom}>
                            <Form.Label><span className="ml-2">Salón #</span></Form.Label>
                            <Form.Control className="ml-2" type="text" name="classRoom_id" value={this.state.classRoom_id} onChange={this.handleChange}/>
                            <Form.Label><span className="ml-2">Capacidad</span></Form.Label>
                            <Form.Control className="ml-2" type="text" name="capacity" value={this.state.capacity} onChange={this.handleChange} />
                            <Form.Label><span className="ml-2">Programa</span></Form.Label>
                            <Form.Control className="ml-2" as="select">
                                <option>FIET</option>
                                <option>PIET</option>
                                <option>Contables</option>
                            </Form.Control>
                            <Button className="ml-2 rounded-10" variant="primary" type="submit">Agregar Salón</Button>
                        </Form>
                    </Navbar>
            </div>
        )
    }
}

export default CMaddClassroom;