import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'

import {
  setChannel as setChannelAction,
  setPrivateChannel,
} from '../../store/channels/actions'

export default function Starred() {
  const [starredChannels, setStarredChannels] = React.useState([])
  const dispatch = useDispatch()

  const renderStarredChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => channelClickHandler(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={''}
      >
        {/* {getNotificationCount(channel) && (
          <Label>{getNotificationCount(channel)}</Label>
        )} */}
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
