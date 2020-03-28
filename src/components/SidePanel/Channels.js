import React, { useState, useEffect } from 'react'
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'

import {
  setChannel as setChannelAction,
  setPrivateChannel,
} from '../../store/channels/actions'
import firebase from '../../firebase'

export default function Channels() {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.currentUser)
  const [modal, setModal] = useState(false)
  const [channelName, setChannelName] = useState('')
  const [channelDesc, setChannelDesc] = useState('')
  const [channelsRef] = useState(firebase.database().ref('channels'))
  const [messagesRef] = useState(firebase.database().ref('messages'))
  const [currentChannel, setCurrentChannel] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [channels, setChannels] = useState([])
  const [loadedFirst, setLoadedFirst] = useState(true)
  const [activeChannel, setActiveChannel] = useState('')

  useEffect(() => {
    registerGetAllChanelLister()
    return () => {
      removeChannelListeners()
    }
  }, [currentChannel])

  useEffect(() => {
    const firstChannel = channels[0]
    if (loadedFirst && channels.length > 0) {
      dispatch(setChannelAction(firstChannel))
      setActiveChannel(firstChannel.id)
      setCurrentChannel(firstChannel)
      setLoadedFirst(false)
    }
  }, [channels])

  const registerGetAllChanelLister = () => {
    channelsRef.on('child_added', snap => {
      const channel = snap.val()
      setChannels(prevChannels => {
        if (!prevChannels.find(c => c.id === channel.id)) {
          return prevChannels.concat(channel)
        }
        return prevChannels
      })
      addNotificationListener(snap.key)
    })
  }

  const addNotificationListener = channelId => {
    messagesRef.child(channelId).on('value', snap => {
      if (currentChannel) {
        handleNotification(channelId, currentChannel.id, notifications, snap)
      }
    })
  }

  const handleNotification = (
    channelId,
    currentChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0
    let index = notifications.findIndex(noti => noti.id === channelId)

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren()
    } else {
      notifications.push({
        id: currentChannel.id,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      })
    }
    setNotifications(() => [...notifications])
  }

  const removeChannelListeners = () => channelsRef.off()

  const openModal = () => setModal(true)

  const closeModal = () => {
    // reset the state
    setChannelName('')
    setChannelDesc('')
    setModal(false)
  }

  const channelClickHandler = channel => {
    setActiveChannel(channel.id)
    setCurrentChannel(channel)
    clearNotifications()
    dispatch(setChannelAction(channel))
    dispatch(setPrivateChannel(false))
  }

  const clearNotifications = () => {
    let index = notifications.findIndex(
      notification => notification.id === currentChannel.id
    )

    if (index !== -1) {
      let updatedNotifications = [...notifications]
      updatedNotifications[index].total = notifications[index].lastKnownTotal
      updatedNotifications[index].count = 0
      setNotifications(updatedNotifications)
    }
  }

  const getNotificationCount = channel => {
    let count = 0
    notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count
      }
    })

    if (count > 0) return count
  }

  const renderChannels = _channels =>
    _channels.length > 0 &&
    _channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => channelClickHandler(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel}
      >
        {getNotificationCount(channel) && (
          <Label>{getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ))

  const submitHandler = async event => {
    event.preventDefault()

    try {
      if (isFormValid()) {
        const key = channelsRef.push().key
        const newChannel = {
          id: key,
          name: channelName,
          description: channelDesc,
          createdBy: {
            name: currentUser.displayName,
            avatar: currentUser.photoURL,
          },
        }
        await channelsRef.child(key).update(newChannel)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const isFormValid = () => channelName && channelDesc

  return (
    <>
      <Menu.Menu style={{ paddingBottom: '2rem' }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> Channels
          </span>{' '}
          ({channels.length}) <Icon name="add" onClick={openModal} />
        </Menu.Item>
        {renderChannels(channels)}
      </Menu.Menu>
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                fluid
                label="Name"
                value={channelName}
                onChange={event => setChannelName(event.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="Description"
                value={channelDesc}
                onChange={event => setChannelDesc(event.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="purple" inverted onClick={submitHandler}>
            <Icon name="checkmark" />
            Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}
