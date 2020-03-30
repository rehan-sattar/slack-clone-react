import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { Segment, Input, Button } from 'semantic-ui-react'

import firebase from '../../firebase'
import UploadFileModal from './UploadFileModal'
import ProgressBar from './ProgressBar'

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
    return isChannelPrivate ? `chat/private-${channelId}` : `chat/public`
  }

  const uploadFile = (file, metaData) => {
    setPathToUpload(currentChannel.id)
    const filePath = `${getFilePath(currentChannel.id)}/${uuid()}.jpg`
    setUploadState('UPLOADING')
    const fileReference = storageRef.child(filePath).put(file, metaData)
    setUploadTask(fileReference)
  }

  const handleKeyDown = () => {
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

  const openModal = () => setModal(true)

  const closeModal = () => setModal(false)

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
        onKeyDown={handleKeyDown}
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
