import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

import 'semantic-ui-css/semantic.min.css'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

const Root = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  </BrowserRouter>
)

ReactDOM.render(<Root />, document.getElementById('root'))
