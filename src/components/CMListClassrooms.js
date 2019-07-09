import React, {Component} from 'react';


export default class CMListClassrooms extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            classRoom: ""

        };
        this.addClassroom = this.addClassroom.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }
    addClassroom(){

    }

    handleChange(event){
        this.setState({ [event.target.name]: [event.target.value]})
    }

    render(){
        return(
            <div></div>
        )
    }
}