import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { Segment, Input, Button } from 'semantic-ui-react'
import { Picker, emojiIndex } from 'emoji-mart'

import firebase from '../../firebase'
import UploadFileModal from './UploadFileModal'
import ProgressBar from './ProgressBar'

import 'emoji-mart/css/emoji-mart.css'

export default function MessagesForm({
  currentChannel,
  currentUser,
  messagesRef,
  isChannelPrivate,
}) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('IDLE')
  const [errors, setErrors] = useState([])
  const [modal, setModal] = useState(false)
  const [storageRef] = useState(firebase.storage().ref())
  const [typingRef] = useState(firebase.database().ref('typing'))
  const [uploadTask, setUploadTask] = useState(null)
  const [percentUpload, setPercentUpload] = useState(0)
  const [uploadState, setUploadState] = useState('')
  const [pathToUpload, setPathToUpload] = useState('')
  const [emojiPicker, setEmojiPicker] = useState(false)
  const messageInputRef = useRef(null)

  useEffect(() => {
    // listener for upload task, when it's done; this will be called.
    if (uploadTask !== null) {
      uploadTask.on(
        'state_changed',
        snap => {
          const percentage = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          )
          setPercentUpload(percentage)
        },
        err => {
          setUploadState('ERROR')
          setErrors(errors => [...errors, err.message])
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadedUrl => {
              sendFileMessage(downloadedUrl, pathToUpload)
            })
            .catch(err => {
              setUploadState('ERROR')
              setErrors(errors => [...errors, err.message])
            })
        }
      )
    }

    return () => {
      if (uploadTask !== null) {
        uploadTask.cancel()
        setUploadTask(null)
      }
    }
  }, [uploadTask])

  const sendFileMessage = (downloadedFileUrl, filePath) => {
    messagesRef()
      .child(filePath)
      .push()
      .set(createMessage(downloadedFileUrl))
      .then(() => {
        setUploadState('DONE')
      })
      .catch(err => {
        setErrors(errors => [...errors, err])
      })
  }

  const createMessage = (file = null) => {
    const messageBody = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    }
    if (file !== null) {
      messageBody['image'] = file
    } else {
      messageBody['content'] = message
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
        await messagesRef()
          .child(currentChannel.id)
          .push()
          .set(createMessage())
        await typingRef
          .child(currentChannel.id)
          .child(currentUser.uid)
          .remove()
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

  const getFilePath = channelId => {
    return isChannelPrivate ? `chat/private/${channelId}` : `chat/public`
  }

  const uploadFile = (file, metaData) => {
    setPathToUpload(currentChannel.id)
    const filePath = `${getFilePath(currentChannel.id)}/${uuid()}.jpg`
    setUploadState('UPLOADING')
    const fileReference = storageRef.child(filePath).put(file, metaData)
    setUploadTask(fileReference)
  }

  const handleKeyDown = event => {
    if (event.ctrlKey && event.keyCode === 13) {
      sendMessage()
    }
    if (message) {
      typingRef
        .child(currentChannel.id)
        .child(currentUser.uid)
        .set(currentUser.displayName)
    } else {
      typingRef
        .child(currentChannel.id)
        .child(currentUser.uid)
        .remove()
    }
  }

  const handleEmojiPicker = () => {
    setEmojiPicker(!emojiPicker)
  }

  const handleAddEmoji = emoji => {
    const oldMessage = message
    const newMessage = colonToUnicode(` ${oldMessage} ${emoji.colons} `)
    setMessage(newMessage)
    setEmojiPicker(false)

    setTimeout(() => {
      messageInputRef.current.focus()
    }, 0)
  }

  const colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, '')
      let emoji = emojiIndex.emojis[x]
      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native
        if (typeof unicode !== 'undefined') {
          return unicode
        }
      }
      x = ':' + x + ':'
      return x
    })
  }

  const openModal = () => setModal(true)

  const closeModal = () => setModal(false)

  return (
    <Segment className="message__form">
      {emojiPicker && (
        <Picker
          set="apple"
          className="emojiPicker"
          title="Pick an emoji"
          emoji="point_up"
          onSelect={handleAddEmoji}
        />
      )}
      <Input
        fluid
        style={{ marginBottom: '0.7em' }}
        label={
          <Button
            icon={emojiPicker ? 'close' : 'add'}
            content={emojiPicker ? 'Close' : null}
            onClick={handleEmojiPicker}
          />
        }
        labelPosition="left"
        placeholder="Write your message..."
        value={message}
        onChange={event => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        ref={messageInputRef}
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
          onClick={openModal}
        />
      </Button.Group>
      <UploadFileModal
        open={modal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      <ProgressBar uploadPercent={percentUpload} uploadState={uploadState} />
    </Segment>
  )
}
