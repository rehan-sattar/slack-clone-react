import React, { useState } from 'react'
import { Segment, Comment } from 'semantic-ui-react'

import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'

import firebase from '../../firebase'

export default function Messages({ currentUser, currentChannel }) {
  const [messagesRef] = useState(firebase.database().ref('/messages'))
  return (
    <>
      <MessagesHeader />

      <Segment className="messages">
        <Comment.Group></Comment.Group>
      </Segment>

      <MessagesForm
        currentChannel={currentChannel}
        currentUser={currentUser}
        messagesRef={messagesRef}
      />
    </>
  )
}
