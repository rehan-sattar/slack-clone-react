import React, { useState } from 'react'
import { Segment, Input, Icon, Button } from 'semantic-ui-react'

import firebase from '../../firebase'

export default function MessagesForm({
  currentChannel,
  currentUser,
  messagesRef,
}) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('IDLE')
  const [errors, setErrors] = useState([])

  const createMessage = () => {
    const messageBody = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
      content: message,
    }
    return messageBody
  }

  const resetState = () => {
    setMessage('')
    setErrors(errors => [])
  }

  const sendMessage = async () => {
    if (message) {
      setStatus('PENDING')
      try {
        await messagesRef
          .child(currentChannel.id)
          .push()
          .set(createMessage())
        resetState()
        setStatus('RESOLVED')
      } catch (err) {
        console.log('Error while sending message: ', err)
        setStatus('REJECTED')
        setErrors(errors => [...errors, { message: err.message }])
      }
    } else {
      setErrors(errors => [...errors, { message: 'Add a message..' }])
    }
  }

  return (
    <Segment className="message__form">
      <Input
        fluid
        style={{ marginBottom: '0.7em' }}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write your message..."
        value={message}
        onChange={event => setMessage(event.target.value)}
        className={
          errors.some(err => err.message.includes('message')) ? 'error' : ''
        }
      />
      <Button.Group icon widths="2">
        <Button
          color="purple"
          content="Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          disabled={status === 'PENDING'}
        />
        <Button
          color="green"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  )
}
