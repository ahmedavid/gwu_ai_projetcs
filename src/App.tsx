import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Nav from './Nav';

import { SearchPage } from './sandbox/ai_prj1/SearchPage';
import NetSim from './sandbox/ns_sim/models/NetSim';


function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        

        <Switch>
          <Route path="/">
            <NetSim/>
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
