import React, {Component} from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import { registerLocale} from 'react-datepicker';
//import { Redirect } from "react-router-dom";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);

class FormStartElectivesProcess extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            semesterYear: "2019",
            semesterTerm: 1,
            startDate: new Date(),
            startSemesterDate: new Date(),
            endDate: new Date(),
            endSemesterDate: new Date(),
            focusedSemesterInput: "",
            startTime: new Date(),
            endTime: new Date(),
            focusedInput: "",
            redirect: false, 
            error: false, 
            show: true
        };
        this.newSemester = this.newSemester.bind(this);
        this.redirect = this.redirect.bind(this);
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.handleChangeSemesterStart = this.handleChangeSemesterStart.bind(this);
        this.handleChangeSemesterEnd = this.handleChangeSemesterEnd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    }

    handleChangeEndTime(time){
        this.setState({
            endTime: time
        });
    }

    handleChangeStartTime(time){
        this.setState({
            startTime: time
        });
    }

    handleChange(event){
        this.setState({ [event.target.name]: [event.target.value]})
    }
    handleChangeSemesterStart(sDate){
        this.setState({
            startSemesterDate: sDate
        });        
    }
    handleChangeSemesterEnd(eDate){
        this.setState({
            endSemesterDate: eDate
        });
        console.log(this.state.endSemesterDate);
    }

    handleChangeStart(sDate){
        //this.setState({ [event.target.name]: event.target.value });
        this.setState({
            startDate: sDate
            
        });

        console.log(this.state.startDate);
    }

    handleChangeEnd(eDate){
        //this.setState({ [event.target.name]: event.target.value });
        this.setState({
            endDate: eDate
        });
        console.log(this.state.endDate);

        
    }
    redirect(){
        this.setState({redirect: true});
        this.setState({error: false});
        console.log(this.state.error);
    }

    newSemester(event){

        const { semesterYear, semesterTerm, startDate, startSemesterDate, endDate, endSemesterDate, startTime, endTime } = this.state;
        event.preventDefault();
        var fechaInicio = startDate.getFullYear()+"-"+startDate.getMonth()+"-"+startDate.getDate();
        var fechaFinal = endDate.getFullYear()+"-"+endDate.getMonth()+"-"+endDate.getDate();
        var fechaSemestreInicio = startSemesterDate.getFullYear()+"-"+startSemesterDate.getMonth()+"-"+startSemesterDate.getDate()+"T"+startTime.getHours()+":"+ startTime.getMinutes()+":"+startTime.getSeconds();
        var fechaSemestreFinal = endSemesterDate.getFullYear()+"-"+endSemesterDate.getMonth()+"-"+endSemesterDate.getDate()+"T"+endTime.getHours()+":"+ endTime.getMinutes()+":"+endTime.getSeconds();
        var json = { "year": semesterYear,
        "period": semesterTerm,
        "from_date": fechaInicio,
        "until_date": fechaFinal,
        "from_date_vote": fechaSemestreInicio,
        "until_date_vote": fechaSemestreFinal }
        axios.post('http://localhost:8000/api/semester/' , json )
            .then(response => this.redirect(response))
            .catch(error => {
                this.setState({ error: true})
            });

        console.log("año semestre " + semesterYear);
        console.log("año periodo " + semesterTerm);
        console.log("fecha inicio " + fechaInicio);        
        console.log("fecha final " + fechaFinal);        
        console.log("fecha Semestre inicio " + fechaSemestreInicio);        
        console.log("fecha Semestre final " + fechaSemestreFinal);            
        
    }

    componentWillMount() {
        console.log('call create')
    }

    componentWillUnmount() {
        console.log('call destroy')
    }

    render(){
        if(this.state.redirect){
            // redireccionamos a la gestion de salones
        }
        const handleShow = () => this.setState({ show: true });     
        const handleDismiss = () => this.setState({ show: false });     
        return(
            <div className="card">
                <div className="card-header">
                    <span className="h3 center font-weight-bold">INICIAR PROCESO DE ELECTIVAS</span>
                </div>
                <Form onSubmit = {this.newSemester}>
                    <div className="btn-group-vertical">
                        <Form.Label><span className="h4">Semestre</span></Form.Label>
                        <div className="align-baseline">
                            <Form.Control as="select">
                                    <option >2019</option>
                                    <option >2020</option>
                                    <option >2021</option>
                            </Form.Control>
                            <Form.Label><span className="h4">Periodo</span></Form.Label>
                            <Form.Control as="select" value={this.state.semesterTerm} onChange={this.handleChange}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </Form.Control>
                        </div>

                        <Form.Label><span className="h4 mt-3">Fechas Semestre</span></Form.Label>
                        <DatePicker
                            selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeStart}
                            placeholderText="Fecha Inicio"
                            dateFormat="dd/MM/yyyy"         
                        />
                        <DatePicker
                            selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeEnd}
                            minDate={this.state.startDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Fecha Final"             
                        />
                        <DatePicker
                            selected={this.state.startTime}
                            onChange={this.handleChangeStartTime}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                        />
                        <Form.Label><span className="h4 mt-3">Fechas Proceso de Electivas</span></Form.Label>
                        <DatePicker
                            selected={this.state.startSemesterDate}
                            selectsStart
                            startDate={this.state.startSemesterDate}
                            endDate={this.state.endSemesterDate}
                            onChange={this.handleChangeSemesterStart} 
                            placeholderText="Fecha Inicio"   
                            dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker
                            selected={this.state.endSemesterDate}
                            selectsStart
                            startDate={this.state.startSemesterDate}
                            endDate={this.state.endSemesterDate}
                            onChange={this.handleChangeSemesterEnd} 
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Fecha Final"    
                        />
                        <DatePicker
                            selected={this.state.endTime}
                            onChange={this.handleChangeEndTime}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            dateFormat="h:mm aa"
                            timeCaption="Time"
                        />
                        <Button className="mt-3 rounded-10"  onClick={ handleShow } variant="primary" type="submit">Iniciar Nuevo Semestre</Button>

                    </div>
                    <div className="no-login">
                        <Alert variant="danger" show={ this.state.show && this.state.error } onClose={ handleDismiss } dismissible>
                            <p>Hubo un error al iniciar el proceso de electivas</p>
                        </Alert>
                    </div> 
                </Form>
            </div>
        )
    }
}

export default FormStartElectivesProcess;