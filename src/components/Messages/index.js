import React, { useState, useEffect, isValidElement } from 'react'
import { Segment, Comment } from 'semantic-ui-react'

import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import Message from './Message'

import firebase from '../../firebase'

export default function Messages({ currentUser, currentChannel }) {
  const [user] = useState(currentUser)
  const [channel] = useState(currentChannel)
  const [messagesRef] = useState(firebase.database().ref('/messages'))
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (user && channel) {
      addListeners(channel)
    }
    return () => {
      removeAllListeners()
    }
  }, [])

  const addListeners = channel => {
    channelListener(channel.id)
  }

  const channelListener = channelId => {
    messagesRef.child(channelId).on('child_added', snap => {
      const message = snap.val()
      setMessages(messages => [...messages, message])
    })
  }

  const removeAllListeners = () => {}

  const getChannelName = channel => (channel ? `#${channel.name}` : '')

  const getUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc
    }, [])

    const numUniqueUsers = uniqueUsers.length
    const areUserPlurals = numUniqueUsers > 1 || numUniqueUsers === 0
    return `${numUniqueUsers} user${areUserPlurals && 's'}`
  }

  return (
    <>
      <MessagesHeader
        channelName={getChannelName(channel)}
        users={getUniqueUsers(messages)}
      />

      <Segment className="messages">
        <Comment.Group>
          {messages.length > 0 &&
            messages.map(message => (
              <Message key={message.timestamp} message={message} user={user} />
            ))}
        </Comment.Group>
      </Segment>

      <MessagesForm
        currentChannel={currentChannel}
        currentUser={currentUser}
        messagesRef={messagesRef}
      />
    </>
  )
}
