import React from 'react'
import { Grid } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import ColorPanel from './ColorPanel'
import SidePanel from './SidePanel'
import Messages from './Messages'
import MetaPanel from './MetaPanel'

import './App.css'

export default function App() {
  const currentUser = useSelector(state => state.user.currentUser)

  return (
    <Grid columns="equal" className="app">
      <ColorPanel />
      <SidePanel currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width="4">
        <MetaPanel />
      </Grid.Column>
    </Grid>
  )
}
