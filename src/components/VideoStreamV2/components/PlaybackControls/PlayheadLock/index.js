/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import { ic_lock } from 'react-icons-kit/md/ic_lock'
import { ic_lock_open } from 'react-icons-kit/md/ic_lock_open'
import { useTheme } from '@material-ui/core/styles'

const SIZE = 14

function PlayheadLock({ isLocked, setIsFollowing, setStopFollowing }) {
  const { palette } = useTheme()
  const iconName = isLocked ? ic_lock : ic_lock_open
  const color = isLocked ? palette.grey[500] : palette.error.main
  const handleClick = isLocked ? setStopFollowing : setIsFollowing
  // handle when custom lock position... store lock position and lock playhead
  const style = {
    color,
    cursor: 'pointer',
  }

  return (
    <div style={style} onClick={handleClick}>
      <Icon icon={iconName} size={SIZE} />
    </div>
  )
}

PlayheadLock.defaultProps = {
  isLocked: true,
  setIsFollowing: () => {},
  setStopFollowing: () => {},
}

PlayheadLock.propTypes = {
  isLocked: PropTypes.bool,
  setIsFollowing: PropTypes.func,
  setStopFollowing: PropTypes.func,
}
export default PlayheadLock
