import React from 'react'
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
  ListItem,
} from 'semantic-ui-react'

export default function MetaPanel({
  isPrivateChannel,
  currentChannel,
  userPosts,
}) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const handleAccordionChange = (event, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  const renderUserPosts = () => {
    return Object.entries(userPosts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value], i) => {
        return (
          <ListItem key={key}>
            <Image avatar src={value.avatar} />
            <List.Content>
              <List.Header as="a">{key}</List.Header>
              <List.Description>{getPostText(value.count)}</List.Description>
            </List.Content>
          </ListItem>
        )
      })
  }

  const getPostText = count =>
    count > 1 || count === 0 ? `${count} posts` : `${count} post`

  if (isPrivateChannel) {
    return null
  }

  return (
    <Segment loading={!currentChannel}>
      <Header as="h3" attached="top">
        About # {currentChannel && currentChannel.name}
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
          {currentChannel && currentChannel.description}
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
          <List>{userPosts && renderUserPosts(userPosts)}</List>
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
          <Header as="h3">
            <Image
              circular
              src={currentChannel && currentChannel.createdBy.avatar}
            />
            {currentChannel && currentChannel.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
