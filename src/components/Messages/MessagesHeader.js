import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'

export default function MessagesHeader({
  channelName,
  users,
  searchTerm,
  handleSearchMessages,
}) {
  return (
    <Segment clearing>
      <Header fluid="true" floated="left" as="h2" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name="star outline" color="black" />
        </span>
        <Header.Subheader>{users}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          size="mini"
          icon="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchMessages}
        />
      </Header>
    </Segment>
  )
}
