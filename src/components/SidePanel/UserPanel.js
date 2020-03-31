import React, { useState, useEffect } from 'react'
import {
  Grid,
  Icon,
  Header,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'

import firebase from '../../firebase'

export default function UserPanel({ currentUser }) {
  const [user] = useState(currentUser)
  const [modal, setModal] = useState(false)
  const [preview, setPreview] = useState('')
  const [croppedImage, setCroppedImage] = useState('')
  const [blob, setBlob] = useState('')
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [storageRef] = useState(firebase.storage().ref())
  const [authUser] = useState(firebase.auth().currentUser)
  const [userRef] = useState(firebase.database().ref('users'))

  let avatarEditor
  const metaData = {
    contentType: 'image/jpeg',
  }

  const userActions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as: <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },

    {
      key: 'avatar',
      text: <span onClick={() => setModal(true)}>Change Avatar</span>,
    },
    {
      key: 'signOut',
      text: <span onClick={signOutUser}>Sign Out</span>,
    },
  ]

  const signOutUser = () => firebase.auth().signOut()

  const handleInputChange = event => {
    const file = event.target.files[0]

    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        setPreview(reader.result)
      })
    }
  }

  const handleCropImage = () => {
    if (avatarEditor) {
      avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob)
        setCroppedImage(imageUrl)
        setBlob(blob)
      })
    }
  }

  const uploadCroppedImage = () => {
    setUploadingImage(true)
    storageRef
      .child(`avatars/users/${user.uid}`)
      .put(blob, metaData)
      .then(snap => {
        snap.ref.getDownloadURL().then(async downloadedUrl => {
          setUploadedCroppedImage(downloadedUrl)
        })
      })
  }

  useEffect(() => {
    if (uploadedCroppedImage) {
      changeAvatar(uploadedCroppedImage)
    }
  }, [uploadedCroppedImage])

  const changeAvatar = async imageUrl => {
    try {
      await authUser.updateProfile({
        photoURL: uploadedCroppedImage,
      })
      await userRef.child(user.uid).update({
        photoUrl: uploadedCroppedImage,
      })
      setUploadingImage(false)
      setModal(false)
    } catch (err) {
      console.error('ERRORS::::', err)
    }
  }
  return (
    <Grid>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          <Header as="h3" inverted floated="left">
            <Icon name="code" />
            <Header.Content>Greetings!</Header.Content>
          </Header>
          <Header inverted as="h4" style={{ padding: '1.2em' }}>
            <Image avatar src={user.photoURL} />
            {/* User menu */}
            <Dropdown
              trigger={<span>{user.displayName}</span>}
              options={userActions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
      {/* Change avatar modal */}
      <Modal basic open={modal}>
        <Modal.Header>Change avatar</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            type="file"
            label="New Avatar"
            onChange={handleInputChange}
          />
          <Grid centered stackable columns="2">
            <Grid.Row centered>
              <Grid.Column className="ui centered align grid">
                {preview && (
                  <AvatarEditor
                    ref={node => (avatarEditor = node)}
                    image={preview}
                    height={220}
                    width={300}
                    scale={1.2}
                  />
                )}
              </Grid.Column>

              <Grid.Column className="ui centered align grid">
                {croppedImage && (
                  <Image
                    style={{ margin: '3.5rem auto' }}
                    width={300}
                    height={200}
                    src={croppedImage}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          {croppedImage && (
            <Button
              color="green"
              inverted
              onClick={uploadCroppedImage}
              disabled={uploadingImage}
            >
              <Icon name="checkmark" />
              Change Avatar
            </Button>
          )}
          <Button color="purple" inverted onClick={handleCropImage}>
            <Icon name="image" />
            Preview
          </Button>
          <Button
            color="red"
            inverted
            onClick={() => {
              setModal(false)
              setPreview('')
            }}
          >
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Grid>
  )
}
