import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { scaleUtc } from '@vx/scale'
import { useAnimationFrame } from 'common/hooks'

import Playhead from '../Playhead'

const propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  labelWidth: PropTypes.number,
  widthPx: PropTypes.any,
  timeRange: PropTypes.array,
}

const LivePlayhead = ({ color, label, labelWidth, widthPx, timeRange }) => {
  const scale = scaleUtc({
    domain: timeRange,
    range: [0, widthPx],
  })

  const [liveTime, setLiveTime] = useState(new Date())
  const { start: startLiveTime, stop: stopLiveTime } = useAnimationFrame(
    deltaTime => {
      setLiveTime(new Date()) // always update live time.
    },
  )

  useEffect(() => {
    startLiveTime()
    return stopLiveTime // cleanup
  }, []) // eslint-disable-line

  return (
    <Playhead
      x={scale(liveTime)}
      color={color}
      label={label}
      labelWidth={labelWidth}
    />
  )
}

LivePlayhead.propTypes = propTypes

export default LivePlayhead
