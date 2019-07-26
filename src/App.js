import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import DashboardSecretary from './components/secretary/DashboardSecretary';
import LoginSecretary from './components/secretary/LoginSecretary';
import AddSemester from './components/semester/AddSemester';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={LoginSecretary} />
        <Route exact path="/dashboard/" component={DashboardSecretary} />
        <Route exact path="/semester/" component={AddSemester} />
      </Router>
      <div className="antorcha"></div>
      <div className="bandera"></div>
    </div>
  );
}

export default App;
