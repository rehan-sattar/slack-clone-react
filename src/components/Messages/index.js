import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Comment } from 'semantic-ui-react'
import { useIsMount } from '../../hooks/isMount'
import { setUserPosts } from '../../store/channels/actions'

import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import Message from './Message'
import Typing from './Typing'

import firebase from '../../firebase'
import Skeleton from './Skeleton'

export default function Messages({ currentUser, currentChannel }) {
  const isMount = useIsMount()
  const [user] = useState(currentUser)
  const [channel] = useState(currentChannel)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchingMessages, setSearchingMessages] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [isStarred, setIsStarred] = useState(true)

  const [messagesRef] = useState(firebase.database().ref('messages'))
  const [privateMessagesRef] = useState(
    firebase.database().ref('privateMessages')
  )
  const [userRef] = useState(firebase.database().ref('users'))
  const [typingRef] = useState(firebase.database().ref('typing'))
  const [connectedRef] = useState(firebase.database().ref('.info/connected'))
  const [listeners, setListeners] = useState([])
  const dispatch = useDispatch()
  const isChannelPrivate = useSelector(state => state.channel.private)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user && channel) {
      addListeners(channel)
      addUserStarListener(channel.id, user.uid)
    }
    return () => {
      return removeAllListeners()
    }
  }, [])

  const addListeners = channel => {
    getAllMessagesListener(channel.id)
    typingListener(channel.id)
  }

  const addToListeners = (id, ref, event) => {
    const index = listeners.findIndex(
      listener =>
        listener.id === id && listener.ref === ref && listener.event === event
    )
    if (index === -1) {
      const newListener = { id, ref, event }
      setListeners(prevListeners => [...prevListeners, newListener])
    }
  }
  /**
   *
   * @param {string} channelId
   * Change listener to the channel, triggers whenever the message is added, get all the messages of channel
   */
  const getAllMessagesListener = channelId => {
    getMessagesRef()
      .child(channelId)
      .on('child_added', snap => {
        const message = snap.val()
        setMessagesLoading(false)
        setMessages(messages => [...messages, message])
      })
    addToListeners(channelId, getMessagesRef(), 'child_added')
  }

  /**
   * Star channel listener
   */

  const addUserStarListener = (channelId, userId) => {
    userRef
      .child(userId)
      .child(`starred`)
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val())
          const prevStarred = channelIds.includes(channelId)
          setIsStarred(prevStarred)
        }
      })
  }

  const handleStarChannel = () => {
    setIsStarred(!isStarred)
  }

  useEffect(() => {
    // If is starred! then add this channel to favorites
    if (!isMount) {
      if (isStarred) {
        userRef.child(`${user.uid}/starred`).update({
          [channel.id]: {
            name: channel.name,
            description: channel.description,
            createdBy: {
              name: channel.createdBy.name,
              avatar: channel.createdBy.avatar,
            },
          },
        })
      } else {
        // if unstarred, then remove this channel from favorites
        userRef.child(`${user.uid}/starred/${channel.id}`).remove(err => {
          if (err !== null) {
            console.error('ERROR: ', err)
          }
        })
      }
    }
  }, [isStarred])

  const typingListener = channelId => {
    let allTypingUsers = []
    typingRef.child(channelId).on('child_added', snap => {
      if (snap.key !== currentUser.id) {
        allTypingUsers.concat({
          id: snap.key,
          name: snap.val(),
        })
        setTypingUsers(allTypingUsers)
      }
    })
    addToListeners(channelId, typingRef, 'child_added')

    typingRef.child(channelId).on('child_removed', snap => {
      const index = allTypingUsers.findIndex(tu => tu.id === snap.key)
      if (index !== -1) {
        allTypingUsers = allTypingUsers.filter(tu => tu.id !== snap.key)
        setTypingUsers(allTypingUsers)
      }
    })
    addToListeners(channelId, typingRef, 'child_removed')

    connectedRef.on('value', snap => {
      if (snap.val === true) {
        typingRef
          .child(currentChannel.id)
          .child(currentUser.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.log(err)
            }
          })
      }
    })
  }

  const removeAllListeners = () => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event)
    })
  }

  const getMessagesRef = () => {
    return isChannelPrivate ? privateMessagesRef : messagesRef
  }
  /**
   *
   * @param {object} channel
   * returns the channel name
   */
  const getChannelName = channel =>
    channel && `${!isChannelPrivate ? '#' : '@'} ${channel.name}`

  /**
   *
   * @param {Array} messages
   * @description Get the total count and generate a readable string
   * @return {string} - {userCount} user{plural ? s : _ }
   */
  const getUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc
    }, [])

    const numUniqueUsers = uniqueUsers.length
    const areUserPlurals = numUniqueUsers > 1 || numUniqueUsers === 0
    return `${numUniqueUsers} user${areUserPlurals && 's'}`
  }

  /**
   *
   * @param {Event} event
   * handles the event change for search field in message header
   */
  const handleSearchMessages = event => {
    setSearchTerm(event.target.value)
    setSearchingMessages(true)
  }

  /**
   * Search effect handler
   * When the search term is changed, we are filtering out the messages
   */
  useEffect(() => {
    const regex = new RegExp(searchTerm, 'gi')
    const results = messages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message)
      }
      return acc
    }, [])
    setSearchResults(results)
    //setting the search indicator after one second
    setTimeout(() => setSearchingMessages(false), 800)
  }, [searchTerm])

  /**
   *
   * @param {Array} messages
   * renders the messages
   */
  const renderMessages = messages => {
    return (
      messages.length > 0 &&
      messages.map(message => (
        <Message key={message.timestamp} message={message} user={user} />
      ))
    )
  }

  const renderSkeleton = loading => {
    return loading ? [...Array(10)].map((_, i) => <Skeleton key={i} />) : null
  }

  /**
   *
   * @description counts the total posts
   * @return {object} users with total post count & avatar
   */

  const countUserPosts = () => {
    const userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        }
      }
      return acc
    }, {})
    dispatch(setUserPosts(userPosts))
  }

  useEffect(() => {
    countUserPosts()
    if (messagesEndRef) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const displayTypingUsers = users => {
    return (
      users.length > 0 &&
      users.map(tu => {
        return (
          <div
            key={tu.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.3em',
            }}
          >
            <span className="user__typing">{tu.name} is typing...</span>
            <Typing />
          </div>
        )
      })
    )
  }

  return (
    <>
      <MessagesHeader
        channelName={getChannelName(channel)}
        users={getUniqueUsers(messages)}
        searchTerm={searchTerm}
        handleSearchMessages={handleSearchMessages}
        searching={searchingMessages}
        isChannelPrivate={isChannelPrivate}
        handleStarChannel={handleStarChannel}
        isStarred={isStarred}
      />

      <Segment className="messages">
        <Comment.Group>
          {renderSkeleton(messagesLoading)}
          {searchTerm
            ? renderMessages(searchResults)
            : renderMessages(messages)}
          <div ref={messagesEndRef}></div>
        </Comment.Group>
        {displayTypingUsers(typingUsers)}
      </Segment>

      <MessagesForm
        currentChannel={currentChannel}
        currentUser={currentUser}
        messagesRef={getMessagesRef}
        isChannelPrivate={isChannelPrivate}
      />
    </>
  )
}
