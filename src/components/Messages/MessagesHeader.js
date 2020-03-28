import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

export default function MessagesHeader({
  channelName,
  users,
  searchTerm,
  handleSearchMessages,
  searching,
  isChannelPrivate,
}) {
  return (
    <Segment clearing>
      <Header fluid="true" floated="left" as="h2" style={{ marginBottom: 0 }}>
        <span>
          {' '}
          {channelName}
          {!isChannelPrivate && <Icon name="star outline" color="black" />}
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
          loading={searching}
        />
      </Header>
    </Segment>
  )
}
