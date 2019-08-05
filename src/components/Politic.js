import React, { Component } from 'react';

export default class Politic extends Component {
    render() {
        return(
            <div className="container-fluid error d-flex justify-content-center">
                <div className="testamento aling-text-justify">
                    <span className="h3">Condiciones de uso y politicas de privacidad</span> <br/>
                    <span class="text-justify">Apreciado usuario, la aplicación web presta el servicio de gestion de electivas de la Universidad del Cauca <br/><br/>
                    <span className="h4">Aceptación de terminos</span><br/>
                    <span class="text-justify">Se presume cuando una usuario accede de forma voluntaria a la aplicación se hace responsable de sus acciones o mal manejo de lo datos.</span><br/>
                    <span class="text-justify">La plataforma tiene como objetivo, brindar un servicio efectivo a las secretarías, docentes y estudiantes del programa Ingerniera de Sistemas</span><br/>
                    <span class="text-justify">La información que se maneja es sensible por lo tanto el manejo de la misma debe ser cuidadoso</span>
                    <span class="text-justify">En caso de mala manipulación de los datos, el usuario deberá remitirse a la decanatura e informar su caso con el fin de realizar las acciones pertinentes.</span>
                    </span>
                </div>
            </div>
        )
    }
}