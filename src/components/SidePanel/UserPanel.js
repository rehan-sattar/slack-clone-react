import React, { useState } from 'react'
import { Grid, Icon, Header, Dropdown, Image } from 'semantic-ui-react'

import firebase from '../../firebase'

export default function UserPanel({ currentUser }) {
  const [user] = useState(currentUser)

  const userActions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as: <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },

    {
      key: 'avatar',
      text: <span>Change Avatar</span>,
    },
    {
      key: 'signOut',
      text: <span onClick={signOutUser}>Sign Out</span>,
    },
  ]

  const signOutUser = () => firebase.auth().signOut()

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          <Header as="h3" inverted floated="left">
            <Icon name="code" />
            <Header.Content>Greetings!</Header.Content>
          </Header>
          <Header inverted as="h4" style={{ padding: '1.2em' }}>
            <Image avatar src={user.photoURL} style={{ marginRight: '10px' }} />
            {/* User menu */}
            <Dropdown
              trigger={<span>{user.displayName}</span>}
              options={userActions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}
