import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import DashboardSecretary from './components/secretary/DashboardSecretary';
import DashboardStudent from './components/student/DashboardStudent';
import DashboardProfessor from './components/professor/DashboardProfessor';
import LoginUser from './components/LoginUser';
import AddSemester from './components/semester/AddSemester';
import ErrorNotFound from './components/404';
import Politic from './components/Politic';

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/" component={LoginUser} />
					<Route exact path="/politicas/" component={Politic} />
					<Route exact path="/semester/" component={AddSemester} />
					<Route exact path="/dashboard/secretary/" component={DashboardSecretary} />
					<Route exact path="/dashboard/student/" component={DashboardStudent} />
					<Route exact path="/dashboard/professor/" component={DashboardProfessor} />
					
					<Route component={ErrorNotFound} />
				</Switch>
			</Router>
			<div className="antorcha"></div>
			<div className="bandera"></div>
		</div>
	);
}

export default App;
