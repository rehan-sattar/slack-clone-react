import React, { useEffect, useState } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { useIsMount } from '../../hooks/isMount'

import {
  setChannel as setChannelAction,
  setPrivateChannel,
} from '../../store/channels/actions'
import firebase from '../../firebase'

export default function Starred({ currentUser }) {
  const [starredChannels, setStarredChannels] = useState([])
  const [userRef] = useState(firebase.database().ref('users'))
  const dispatch = useDispatch()
  const isMount = useIsMount()

  useEffect(() => {
    userRef
      .child(currentUser.uid)
      .child('starred')
      .on('child_added', snap => {
        const starredChannel = { id: snap.key, ...snap.val() }
        setStarredChannels(starredChannels => [
          ...starredChannels,
          starredChannel,
        ])
      })
    return () => {
      userRef.child(`${currentUser.uid}/starred`).off()
    }
  }, [])

  useEffect(() => {
    userRef
      .child(currentUser.uid)
      .child('starred')
      .on('child_removed', snap => {
        const unStarredChannel = { id: snap.key, ...snap.val() }
        const filteredChannels = starredChannels.filter(
          sc => sc.id !== unStarredChannel.id
        )
        setStarredChannels(filteredChannels)
      })
    return () => {
      userRef.child(`${currentUser.uid}/starred`).off()
    }
  }, [starredChannels])

  const renderStarredChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => channelClickHandler(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ))

  const channelClickHandler = channel => {
    // setActiveChannel(channel.id)
    // setCurrentChannel(channel)
    dispatch(setPrivateChannel(false))
    dispatch(setChannelAction(channel))
  }
  return (
    <Menu.Menu style={{ paddingBottom: '2rem' }}>
      <Menu.Item>
        <span>
          <Icon name="star" /> Channels
        </span>{' '}
        ({starredChannels.length})
      </Menu.Item>
      {renderStarredChannels(starredChannels)}
    </Menu.Menu>
  )
}
