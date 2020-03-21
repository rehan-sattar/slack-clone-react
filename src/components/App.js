import React from 'react'
import { Grid } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import ColorPanel from './ColorPanel'
import SidePanel from './SidePanel'
import Messages from './Messages'
import MetaPanel from './MetaPanel'

import './App.css'

export default function App() {
  const { currentUser, currentChannel } = useSelector(({ user, channel }) => ({
    currentUser: user.currentUser,
    currentChannel: channel.currentChannel,
  }))

  return (
    <Grid columns="equal" className="app">
      <ColorPanel />
      <SidePanel
        key={currentUser && currentUser.id}
        currentUser={currentUser}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Grid.Column>
      <Grid.Column width="4">
        <MetaPanel />
      </Grid.Column>
    </Grid>
  )
}
