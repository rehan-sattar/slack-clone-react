import React, { useState } from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export default function Channels() {
  const [channels] = useState([])
  return (
    <Menu.Menu style={{ paddingBottom: '2rem' }}>
      <Menu.Item>
        <span>
          <Icon name="exchange" /> Channels
        </span>{' '}
        ({channels.length}) <Icon name="add" />
      </Menu.Item>
    </Menu.Menu>
  )
}
