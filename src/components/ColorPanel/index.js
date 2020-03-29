import React from 'react'
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment,
} from 'semantic-ui-react'
import { SliderPicker } from 'react-color'

import firebase from '../../firebase'

function ColorPanel({ currentUser }) {
  const [userRef] = React.useState(firebase.database().ref('users'))
  const [open, setOpen] = React.useState(false)
  const [primaryColor, setPrimaryColor] = React.useState('')
  const [secondaryColor, setSecondaryColor] = React.useState('')
  const [colors, setColors] = React.useState([])

  React.useEffect(() => {
    userRef.child(`${currentUser.uid}/colors`).on('child_added', snap => {
      setColors(prevColors => [snap.val(), ...prevColors])
    })
  }, [])

  const openModel = () => setOpen(true)
  const closeModel = () => setOpen(false)

  const handlePrimaryColorChange = color => {
    setPrimaryColor(color.hex)
  }

  const handleSecondaryColorChange = color => {
    setSecondaryColor(color.hex)
  }

  const changeColor = async () => {
    try {
      await userRef.child(`${currentUser.uid}/colors`).update({
        primaryColor,
        secondaryColor,
      })
      console.log('Colors added!')
    } catch (err) {
      console.log('ERROR: ', err)
    }
  }

  const displayColors = colors => {
    return (
      colors.length > 0 &&
      colors.map(
        (color, i) =>
          console.log(color) || (
            <React.Fragment key={i}>
              <Divider />
              <div className="color__container">
                <div
                  className="color__square"
                  style={{ background: color.primaryColor }}
                >
                  <div
                    className="color__overlay"
                    style={{ background: color.secondaryColor }}
                  ></div>
                </div>
              </div>
            </React.Fragment>
          )
      )
    )
  }

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
      <Button
        icon="add"
        size="small"
        color="purple"
        onClick={openModel}
      ></Button>
      {displayColors(colors)}

      {/* Color picker model */}

      <Modal basic open={open}>
        <Modal.Header>Choose an app color</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary Color " />
            <SliderPicker onChange={handlePrimaryColorChange} />
          </Segment>
          <Segment inverted>
            <Label content="Secondary Color" />
            <SliderPicker onChange={handleSecondaryColorChange} />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color="purple" inverted onClick={changeColor}>
            <Icon name="checkmark" /> Set Color
          </Button>
          <Button color="red" inverted onClick={closeModel}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  )
}

const MemoizedColorPanel = React.memo(ColorPanel)

export default MemoizedColorPanel
