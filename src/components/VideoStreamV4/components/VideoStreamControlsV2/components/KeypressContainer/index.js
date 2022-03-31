import React from 'react'
import PropTypes from 'prop-types'
import KeyboardEventHandler from 'react-keyboard-event-handler'
import { useVideoPlayerCommands } from 'common/hooks/video'

import useChangeSliderValue from '../../../../hooks/useChangeSliderValue'
import { DEFAULT_KEYS } from '../../constants'
// https://www.npmjs.com/package/react-keyboard-event-handler

const KeypressContainer = ({ handleKeys, handleEventType, videoStreamKey }) => {
  const changeSliderValue = useChangeSliderValue({ videoStreamKey })

  const {
    playerPlayPause,
    // playerNextFrame,
    // playerPreviousFrame,
    playerMoveSeconds,
  } = useVideoPlayerCommands({ videoStreamKey })

  // @param: key <String> name of key from https://www.npmjs.com/package/react-keyboard-event-handler
  // @param: the keypress event from 'react-keyboard-event-handler'
  //
  const onKeyEvent = (keyPressed, event) => {
    switch (keyPressed) {
      case 'space':
      case 'k':
        playerPlayPause()
        break
      case 'left':
        playerMoveSeconds(-10)
        break
      case 'right':
        playerMoveSeconds(10)
        break
      case 'j':
        playerMoveSeconds(-30)
        break
      case 'l':
        playerMoveSeconds(30)
        break
      // case '1':
      // case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        // case '0':
        changeSliderValue(
          event,
          Number(keyPressed) === 0 ? 0 : 10 - Number(keyPressed),
        )
        break
      default:
        break
    }
  }

  return (
    <KeyboardEventHandler
      handleFocusableElements
      handleEventType={handleEventType}
      handleKeys={handleKeys}
      onKeyEvent={onKeyEvent}
    />
  )
}

KeypressContainer.defaultProps = {
  handleKeys: DEFAULT_KEYS,
  handleEventType: 'keydown',
}
KeypressContainer.propTypes = {
  handleKeys: PropTypes.array,
  handleEventType: PropTypes.oneOf(['keyup', 'keydown', 'keypress']),
  videoStreamKey: PropTypes.string.isRequired,
}

export default KeypressContainer
