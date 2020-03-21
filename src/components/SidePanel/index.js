import React from 'react'
import { Menu } from 'semantic-ui-react'

import UserPanel from './UserPanel'

export default function SidePanel() {
  return (
    <Menu
      inverted
      size="large"
      color="black"
      fixed="left"
      vertical
      style={{ fontSize: '1.2rem' }}
    >
      <UserPanel />
    </Menu>
  )
}
