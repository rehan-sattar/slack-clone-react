import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import firebase from './firebase'

import 'semantic-ui-css/semantic.min.css'

import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  withRouter,
} from 'react-router-dom'

const Root = () => {
  const history = useHistory()
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        history.push('/')
      }
    })
  }, [])
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  )
}

const RootWithRouter = withRouter(Root)
ReactDOM.render(
  <BrowserRouter>
    <RootWithRouter />
  </BrowserRouter>,
  document.getElementById('root')
)
