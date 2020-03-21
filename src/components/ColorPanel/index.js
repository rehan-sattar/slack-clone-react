import React from 'react'
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react'

export default function ColorPanel() {
  return (
    <Sidebar
      as={Menu}
      icons="labeled"
      inverted
      vertical
      visible
      width="very thin"
      style={{ backgroundColor: '#303030' }}
    >
      <Divider />
      <Button icon="add" size="small" color="purple"></Button>
    </Sidebar>
  )
}
