import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector, batch } from 'react-redux'
import clsx from 'clsx'
// src
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import { setIsOpen, setQueryTs } from 'redux/slices/reId'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'

import getVideoStreamControlsState from '../../../../selectors/videoStreamControls/getVideoStreamControlsState'

const propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  videoStreamKey: PropTypes.string,
}

const defaultProps = {
  color: 'white',
  size: 18,
  videoStreamKey: null,
}

const ReIdButton = ({ color, size, videoStreamKey }) => {
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const videoStreamTs = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'videoStreamTS',
    }),
  )

  const handleClick = ts => {
    batch(() => {
      dispatch(setQueryTs(ts)) // set query ts on click
      dispatch(setIsOpen(true))
    })
  }

  return (
    <Tooltip content='Person Search' placement='bottom-start'>
      <div
        className={clsx(flexClasses.row, cursorClasses.pointer)}
        onClick={() => {
          handleClick(videoStreamTs)
        }}
      >
        <Icon icon='person' color={color} size={size} />
      </div>
    </Tooltip>
  )
}

ReIdButton.propTypes = propTypes
ReIdButton.defaultProps = defaultProps

export default ReIdButton
