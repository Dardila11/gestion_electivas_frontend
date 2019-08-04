import React, { Component } from 'react';
import { Form, Button, Row, Col, Modal, Alert, ListGroup } from 'react-bootstrap';

export default class ErrorNonFound extends Component {
    render() {
        return(
            <div className="container-fluid error d-flex align-items-center justify-content-center">
                <div className="alien"></div>
                <div className="texto">
                    <h1 className="titulo-error mb-0">404</h1>
                    <h3 className="float-right">Página no encontrada</h3>
                </div>
            </div>
        )
    }
}