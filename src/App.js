import React from 'react'; 
import { BrowserRouter as Router, Route } from "react-router-dom";
import './style.css'
//import LoginSecretary from './components/LoginSecretary';
import WorkSpaceSecretary from './components/WorkSpaceSecretary';
//import FormStartElectivesProcess from './components/FormStartElectivesProcess';
import CMaddClassroom from './components/CMaddClassroom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={ CMaddClassroom } />
        <Route exact path="/workspace/" component={ WorkSpaceSecretary } />
      </Router>
    </div>
  );
}

export default App;
