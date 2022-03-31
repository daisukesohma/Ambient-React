import React from 'react'
import PropTypes from 'prop-types'
import KeyboardEventHandler from 'react-keyboard-event-handler'

// https://www.npmjs.com/package/react-keyboard-event-handler
const DEFAULT_KEYS = [
  'meta', // drag timeline speed modifier
  'alt', // drag timeline speed modifier
  'space', // video play & pause
  'k',
  'left',
  'right',
  'j',
  'l',
  'm',
  '/',
  ',',
  '.',
  'f',
]

const KeypressContainer = ({ handleKeys, handleEventType, onPress }) => {
  return (
    <KeyboardEventHandler
      handleFocusableElements
      handleEventType={handleEventType}
      handleKeys={handleKeys}
      onKeyEvent={onPress}
    />
  )
}

KeypressContainer.defaultProps = {
  handleKeys: DEFAULT_KEYS,
  handleEventType: 'keydown',
  onPress: () => {},
}
KeypressContainer.propTypes = {
  handleKeys: PropTypes.array,
  handleEventType: PropTypes.oneOf(['keyup', 'keydown', 'keypress']),
  onPress: PropTypes.func,
}
export default KeypressContainer
