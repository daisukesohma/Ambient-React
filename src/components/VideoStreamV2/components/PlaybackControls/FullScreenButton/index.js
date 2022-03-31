import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Icons } from 'ambient_ui'
import { Icon } from 'react-icons-kit'
import { minimize } from 'react-icons-kit/feather/minimize'

import KeyShortcutDisplay from '../KeyShortcutDisplay'
import Tooltip from '../../../../Tooltip'

const { Maximize } = Icons
const ICON_SIZE = 24

const Content = ({ contentName, keyName }) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    {contentName}
    <KeyShortcutDisplay keyName={keyName} />
  </div>
)

const FullScreenButton = ({
  containerStyle,
  iconHeight,
  iconWidth,
  iconStroke,
  iconStyle, // need to tunnel thru to AmbientAI
  isFullScreenVideo,
  handleEnter,
  handleExit,
}) => {
  const containerStyles = useMemo(
    () => ({
      ...styles.container,
      ...containerStyle,
    }),
    [containerStyle],
  )

  return isFullScreenVideo ? (
    <div onClick={handleExit} style={containerStyles}>
      <Tooltip content={<Content contentName='Exit full screen' keyName='f' />}>
        <div>
          <Icon icon={minimize} size={ICON_SIZE} />
        </div>
      </Tooltip>
    </div>
  ) : (
    <div style={containerStyles} onClick={handleEnter}>
      <Tooltip content={<Content contentName='Full screen' keyName='f' />}>
        <div>
          <Maximize stroke={iconStroke} height={iconHeight} width={iconWidth} />
        </div>
      </Tooltip>
    </div>
  )
}

let styles = {
  container: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 5,
  },
}

Content.propTypes = {
  contentName: PropTypes.string,
  keyName: PropTypes.string,
}

FullScreenButton.defaultProps = {
  containerStyle: {},
  handleEnter: () => {},
  handleExit: () => {},
  iconHeight: ICON_SIZE,
  iconStroke: '#626469',
  iconStyle: {},
  iconWidth: ICON_SIZE,
  isFullScreenVideo: false,
  onClick: () => {},
}

FullScreenButton.propTypes = {
  containerStyle: PropTypes.object,
  handleEnter: PropTypes.func,
  handleExit: PropTypes.func,
  iconHeight: PropTypes.number,
  iconStroke: PropTypes.string,
  iconStyle: PropTypes.object,
  iconWidth: PropTypes.number,
  isFullScreenVideo: PropTypes.number,
  onClick: PropTypes.func,
}

export default FullScreenButton
