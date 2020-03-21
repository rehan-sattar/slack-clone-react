import React, { useState, useEffect } from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'

import { setChannel } from '../../store/channels/actions'
import firebase from '../../firebase'

export default function Channels() {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.currentUser)
  const [modal, setModal] = useState(false)
  const [channelName, setChannelName] = useState('')
  const [channelDesc, setChannelDesc] = useState('')
  const [channelsRef] = useState(firebase.database().ref('/channels'))
  const [channels, setChannels] = useState([])

  const registerGetAllChanelLister = () => {
    channelsRef.on('child_added', snap => {
      const channel = snap.val()
      setChannels(prevChannels => [...prevChannels, channel])
    })
  }

  useEffect(() => {
    registerGetAllChanelLister()
  }, [])

  const closeModal = () => {
    // reset the state
    setChannelName('')
    setChannelDesc('')
    setModal(false)
  }

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

  const channelClickHandler = channel => {
    dispatch(setChannel(channel))
  }

  const isFormValid = () => channelName && channelDesc

  const openModal = () => setModal(true)

  const renderChannels = _channels =>
    _channels.length > 0 &&
    _channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => channelClickHandler(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ))

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
