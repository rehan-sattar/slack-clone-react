import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import firebase from './firebase'
import store from './store'

import 'semantic-ui-css/semantic.min.css'

import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  withRouter,
} from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { setUser } from './store/auth/actions'

const Root = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user))
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
  <Provider store={store}>
    <BrowserRouter>
      <RootWithRouter />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
