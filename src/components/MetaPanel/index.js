import React from 'react'
import { Segment, Accordion, Header, Icon } from 'semantic-ui-react'

export default function MetaPanel({ isPrivateChannel }) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const handleAccordionChange = (event, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  if (isPrivateChannel) {
    return null
  }

  return (
    <Segment>
      <Header as="h3" attached="top">
        About # channel
      </Header>

      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleAccordionChange}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          Channel Details
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleAccordionChange}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          Userss..
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleAccordionChange}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          Creator
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
