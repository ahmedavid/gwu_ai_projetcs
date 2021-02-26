import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Nav from './Nav';
import { MapColoring } from './sandbox/ai_projects/ai_prj2/MapColoring';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        

        <Switch>
          <Route path="/">
            <MapColoring/>
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
