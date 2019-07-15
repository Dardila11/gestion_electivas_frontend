import React from 'react'; 
import { BrowserRouter as Router, Route } from "react-router-dom";
import DashboardSecretary from './components/DashboardSecretary';
import LoginSecretary from './components/LoginSecretary';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={ LoginSecretary } />
        <Route exact path="/dashboard/" component={ DashboardSecretary } />
      </Router>
      <div className="antorcha"></div>
      <div className="bandera"></div>  
    </div>
  );
}

export default App;
