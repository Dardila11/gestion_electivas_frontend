import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt, faMapMarkedAlt, faHandPointRight } from '@fortawesome/free-solid-svg-icons'

export default class Footer extends Component {
    render() {
        return (
            <div className="container-footer">
                <footer className="d-flex row footer">
                    <div className="seccion-logo col-md-2">
                        <div className="logo"></div>
                    </div>
                    <div className="seccion-footer pt-3 col-md-2">
                        <span className="negrilla d-block">Acerca de</span>
                        <span>Politcas de seguridad</span>
                    </div>
                    <div className="seccion-footer pt-3 col-md-2">
                        <span className="negrilla d-block">Sobre nostros</span>
                        <span className="d-block">Fotos</span>
                    </div>
                    <div className="seccion-footer pt-3 col-md-2">
                        <span className="negrilla">Enlaces</span>
                        <div className="facebook d-block"></div>
                    </div>
                    <div className="seccion-footer pt-3 col-md-4">
                        <span className="negrilla">Contacto</span>
                        <span className="d-block"><FontAwesomeIcon icon={faPhoneAlt} /> (2) 8209800</span>
                        <span className="d-block"><FontAwesomeIcon icon={faMapMarkedAlt} /> Cra. 2 ##4N-140, Popayán, Cauca</span>
                        <span className="d-block"><FontAwesomeIcon icon={faHandPointRight} /> Facultad de Ingenieria Electronica y Telecomunicaciones - FIET</span>
                    </div>
                </footer>
            </div>
        )
    }
}