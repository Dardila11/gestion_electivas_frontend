import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import FormStarElectivesProcess from './FormStartElectivesProcess';
import NavBar from './NavBar';
import { Redirect } from "react-router-dom";
import axios from 'axios';


export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      isLogin: true,
    };
  }

  componentWillMount() {
    const token = JSON.parse(localStorage.getItem('token'));
        axios.post('http://localhost:8000/api/verificate/', { "token": token })
        .catch(error => {
            this.setState({ isLogin: false });
        });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
      render() {
        if(!this.state.isLogin){
          return <Redirect to='/'/>;
        }
        return (

          <div className="cajon">
              <div className="topbar">
              <NavBar/>
              </div>
          <Row>
            <Col xs="6" sm="4" md="4">
              <Nav tabs vertical pills>
                <NavItem>
                  <NavLink
                    className={classnames({active: this.state.activeTab === '1'})}
                    onClick={() => {
                      this.toggle('1');
                    }}
                  >
                    GESTIONAR SALONES
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({active: this.state.activeTab === '2'})}
                    onClick={() => {
                      this.toggle('2');
                    }}
                  >
                   GESTIONAR ELECTIVAS
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({active: this.state.activeTab === '3'})}
                    onClick={() => {
                      this.toggle('3');
                    }}
                  >
                   REGISTRAR ESTUDIANTES
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({active: this.state.activeTab === '4'})}
                    onClick={() => {
                      this.toggle('4');
                    }}
                  >
                   CONFIGURACIÓN
                  </NavLink>
                </NavItem>
                
              </Nav>
            </Col>
            <Col xs="6" sm="6" md="6">
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <div className="calendar"><FormStarElectivesProcess/></div>
                  
                </TabPane>
                <TabPane tabId="2">
                  <h4>ELECTIVAS</h4>
                </TabPane>
                <TabPane tabId="3">
                  <h4>ESTUDIANTES</h4>
                </TabPane>
                <TabPane tabId="4">
                  <h4>CONFIGURACIÓN</h4>
                </TabPane>             
              </TabContent>
            </Col>
          </Row>
          </div>
        )
      }
}