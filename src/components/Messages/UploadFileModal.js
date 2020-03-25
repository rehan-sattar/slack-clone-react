import React from 'react'
import mime from 'mime-types'
import { Modal, Button, Input, Icon } from 'semantic-ui-react'

export default function UploadFileModal({ open, closeModal, uploadFile }) {
  const [file, setFile] = React.useState(null)

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file !== null) {
      if (isFileAuthorized(file.name)) {
        const metaData = {
          contentType: mime.contentType(file.name),
        }
        uploadFile(file, metaData)
        closeModal()
      }
    }
  }

  const isFileAuthorized = fileName =>
    ['image/jpeg', 'image/png'].includes(mime.lookup(fileName))

  const clearFile = () => setFile(null)

  return (
    <Modal open={open} onClose={closeModal}>
      <Modal.Header>Select a file</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          type="file"
          label="Upload File(jpeg, png)"
          value={file}
          onChange={handleFileChange}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={setFile} color="green">
          <Icon name="cloud upload" /> Upload
        </Button>
        <Button
          onClick={() => {
            setFile('')
            closeModal()
          }}
          color="red"
        >
          <Icon name="remove" />
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
