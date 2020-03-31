import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Spinner from './components/Spinner'
import firebase from './firebase'
import store from './store'

import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  withRouter,
} from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './store/auth/actions'

import 'semantic-ui-css/semantic.min.css'

const Root = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.user.isLoading)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user))
        history.push('/')
      } else {
        history.replace('/login')
        dispatch(clearUser())
      }
    })
  }, [history, dispatch])

  return isLoading ? (
    <Spinner />
  ) : (
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
