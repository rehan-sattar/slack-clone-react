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
  handleStarChannel,
  isStarred,
}) {
  return (
    <Segment clearing>
      <Header fluid="true" floated="left" as="h2" style={{ marginBottom: 0 }}>
        <span>
          {' '}
          {channelName}
          {!isChannelPrivate && (
            <Icon
              onClick={handleStarChannel}
              name={isStarred ? 'star' : 'star outline'}
              color={isStarred ? 'yellow' : 'black'}
            />
          )}
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
