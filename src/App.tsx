import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Nav from './Nav';
import { TicTacToe } from './sandbox/ai_projects/ai_prj3/TicTacToe';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        

        <Switch>
          <Route path="/">
            <TicTacToe/>
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
