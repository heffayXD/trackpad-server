import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Home from '../views/Home'

const Navigation = props => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default Navigation
