import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'

export default function Spinner() {
  return (
    <Dimmer active>
      <Loader size="huge" content="Preparing chat..." />
    </Dimmer>
  )
}
