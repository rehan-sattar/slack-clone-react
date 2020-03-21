import React from 'react'
import { Comment } from 'semantic-ui-react'

export default function Message({ message, user }) {
  return (
    <Comment>
      <Comment.Avatar src={user.photoURL} />
      <Comment.Content>{message.content}</Comment.Content>
    </Comment>
  )
}
