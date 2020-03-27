import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'

const isOwnUser = (message, user) =>
  message.user.id === user.uid ? 'message__self' : ''

const timeFromNow = timestamp => moment(timestamp).fromNow()

export default function Message({ message, user }) {
  const isImage = message =>
    message.hasOwnProperty('image') && !message.hasOwnProperty('content')

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnUser(message, user)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>

        {isImage(message) ? (
          <Image src={message.image} style={{ padding: '1em' }} />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  )
}
