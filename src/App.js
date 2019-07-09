import React from 'react'; 
import { BrowserRouter as Router, Route } from "react-router-dom";
import './style.css'
//import LoginSecretary from './components/LoginSecretary';
import WorkSpaceSecretary from './components/WorkSpaceSecretary';
import FormStartElectivesProcess from './components/FormStartElectivesProcess';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={ FormStartElectivesProcess } />
        <Route exact path="/workspace/" component={ WorkSpaceSecretary } />
      </Router>
    </div>
  );
}

export default App;
