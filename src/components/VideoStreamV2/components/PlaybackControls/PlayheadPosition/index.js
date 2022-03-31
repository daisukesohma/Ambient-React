/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import {
  AiOutlineBorderRight,
  AiOutlineBorderLeft,
  AiOutlineBorderHorizontal,
} from 'react-icons/ai'
import { IconContext } from 'react-icons'

import Tooltip from '../../../../Tooltip'

const SIZE = 22

const PlayheadPosition = ({
  cb,
  isPlayheadInRange,
  playheadFixedPosition,
  isLocked,
  setPlayheadFixedPosition,
}) => {
  const { palette } = useTheme()
  const PositionIconContainer = ({ position }) => {
    const isSelected = playheadFixedPosition === position
    const content = isSelected
      ? `Playhead locked on ${position}`
      : `Set playhead position to ${position}`
    const color =
      isLocked && isSelected ? palette.error.main : palette.grey[300]
    const handleClick = () => {
      setPlayheadFixedPosition(position)
      if (cb) {
        cb()
      }
    }

    const PositionIcon = ({ icon }) => {
      if (icon === 'left') {
        return <AiOutlineBorderLeft />
      }
      if (icon === 'center') {
        return <AiOutlineBorderHorizontal />
      }
      if (icon === 'right') {
        return <AiOutlineBorderRight />
      }
      return <div />
    }

    const providerStyle = {
      style: {
        cursor: 'pointer',
      },
      color,
      size: SIZE,
    }

    return (
      <Tooltip content={content}>
        <div>
          <IconContext.Provider value={providerStyle}>
            <div onClick={handleClick}>
              <PositionIcon icon={position} />
            </div>
          </IconContext.Provider>
        </div>
      </Tooltip>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <PositionIconContainer position='left' />
        <PositionIconContainer position='center' />
        <PositionIconContainer position='right' />
      </div>
    </div>
  )
}

PlayheadPosition.defaultProps = {
  cb: () => {},
  isLocked: true,
  isPlayheadInRange: true,
  playheadFixedPosition: 'right',
  setPlayheadFixedPosition: () => {},
}

PlayheadPosition.propTypes = {
  cb: PropTypes.func,
  isLocked: PropTypes.bool,
  isPlayheadInRange: PropTypes.bool,
  playheadFixedPosition: PropTypes.string,
  setPlayheadFixedPosition: PropTypes.func,
}

export default PlayheadPosition
