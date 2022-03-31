import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'
import { useSelector } from 'react-redux'
import { chevronLeft } from 'react-icons-kit/feather/chevronLeft'
import { chevronRight } from 'react-icons-kit/feather/chevronRight'
import { repeat } from 'react-icons-kit/feather/repeat'
import clsx from 'clsx'
// src
import CircularIconButton from 'components/Buttons/CircularIconButton'
import { useFlexStyles } from 'common/styles/commonStyles'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import useGotoPlaybackTime from '../../../../../../hooks/useGotoPlaybackTime'

import useInstanceContext from './useInstanceContext'

const propTypes = {
  metadataKey: PropTypes.string,
  videoStreamKey: PropTypes.string,
}

function CurveInstancePlayer({ metadataKey, videoStreamKey }) {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const gotoPlaybackTime = useGotoPlaybackTime({ videoStreamKey })
  const { getInstanceContext } = useInstanceContext({
    videoStreamKey,
    metadataKey,
  })

  const currentPlayTime = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playTime',
    }),
  )
  const { current, previous, next, withinIndex } = getInstanceContext(
    currentPlayTime,
  )

  const hasPrevious = !!previous.start
  const hasNext = !!next.start
  const hasCurrent = !!current.start

  const onClick = time => {
    if (time) {
      gotoPlaybackTime(time)
    }
  }

  const handlePrevious = () => {
    if (previous.start) onClick(previous.start)
    if (!previous.start && current.start) onClick(current.start)
  }

  const handleNext = () => {
    if (next.start) onClick(next.start)
    if (!next.start && current.end) onClick(current.end)
  }

  const activeColor = palette.primary.main
  const inactiveColor = palette.grey[700]

  return (
    <div className={clsx(flexClasses.row, flexClasses.centerAll)}>
      <div onClick={handlePrevious} style={{ margin: '0 2px' }}>
        <CircularIconButton
          borderWidth={1}
          iconNode={
            <span style={{ color: hasPrevious ? activeColor : inactiveColor }}>
              <Icon icon={chevronLeft} />
            </span>
          }
          tooltipDisabled={!hasPrevious}
          tooltipContent={hasPrevious ? `Previous` : 'No previous'}
        />
      </div>
      <div onClick={() => onClick(current.start)} style={{ margin: '0 2px' }}>
        <CircularIconButton
          borderWidth={1}
          iconNode={
            <span style={{ color: hasCurrent ? activeColor : inactiveColor }}>
              <Icon icon={repeat} size={16} />
            </span>
          }
          tooltipDisabled={withinIndex < -1}
          tooltipContent={hasCurrent ? 'Replay Current' : 'No current'}
        />
      </div>
      <div onClick={handleNext} style={{ margin: '0 2px' }}>
        <CircularIconButton
          borderWidth={1}
          iconNode={
            <span style={{ color: hasNext ? activeColor : inactiveColor }}>
              <Icon icon={chevronRight} />
            </span>
          }
          tooltipDisabled={withinIndex < -1}
          tooltipContent={hasNext ? `Next` : 'No next'}
        />
      </div>
    </div>
  )
}

CurveInstancePlayer.propTypes = propTypes
export default CurveInstancePlayer
