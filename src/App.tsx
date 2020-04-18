import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import MainViewer from './MainViewer';
import SignInPage from './SignIn';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/xbox/:username'>
          <MainViewer platform='Xbox' />
        </Route>
        <Route path='/psn/:username'>
          <MainViewer platform='PSN' />
        </Route>
        <Route path='/stadia/:username'>
          <MainViewer platform='Stadia' />
        </Route>
        <Route path='/steam/:username'>
          <MainViewer platform='Steam' />
        </Route>
        <Route path='/'>
          <SignInPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
