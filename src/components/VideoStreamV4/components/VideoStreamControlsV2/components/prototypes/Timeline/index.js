import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import moment from 'moment'
import useResizeAware from 'react-resize-aware'
// src
import { useVideoCommands } from 'common/hooks/video'

import TimeMinimap from '../TimeMinimap'

import useStyles from './styles'

// import Playhead from './Playhead'
const propTypes = {
  userActive: PropTypes.bool,
  videoStreamKey: PropTypes.string,
  streamId: PropTypes.string,
  nodeId: PropTypes.string,
}

const defaultProps = {
  userActive: false,
  videoStreamKey: null,
  streamId: null,
  nodeId: null,
}

const Timeline = ({ videoStreamKey, streamId, nodeId }) => {
  // Assumptions
  // input starts at 0 (relative timestamp)
  // 0 represents start of current day

  // We may add
  // * have input be unixTs
  // * have utility functions to transform between UnixTs and current day relative timestamp
  const { deviceGetVideoAtTime } = useVideoCommands({ videoStreamKey })
  const [resizeListener, sizes] = useResizeAware()
  const classes = useStyles()
  // const userActive = useSelector(state => get(state, `videoStreamControls[${videoStreamKey}].userActive`))
  const [tooltipLeft, setTooltipLeft] = useState(0)
  const [tooltipText, setTooltipText] = useState('')
  const [tooltipOn, setTooltipOn] = useState(false)

  const [maxTimeline, setMaxTimeline] = useState(86400)

  // 0 is seconds from midnight
  const [minTimeline, setMinTimeline] = useState(0) // eslint-disable-line
  // step is in seconds
  const [stepTimeline, setStepTimeline] = useState(1) // eslint-disable-line

  const startOfDayTs = moment()
    .startOf('day')
    .unix()
  const nowTs = moment().unix() - startOfDayTs

  const [sliderValue, setSliderValue] = useState(nowTs)

  const handleMouseMove = e => {
    updateSeekTooltipMouse(e)
  }

  function updateSeekTooltipMouse(event) {
    const skipTo = Math.round(
      (event.clientX / sizes.width) * parseInt(maxTimeline, 10),
    ) // event.target.clientWidth
    setTooltipText(
      moment.unix(startOfDayTs + minTimeline + skipTo).format('LTS'),
    )
    setTooltipLeft(event.pageX)
  }

  const onTouchMove = e => {
    const touches = e.changedTouches // fingers touching the screen
    if (touches) {
      updateSeekTooltipTouch(touches[0])
    }
  }

  const handleTouchStart = e => {
    //  switch (e.touches.length) {
    //   case 1: console.log('one finger'); break;// handleOneTouch(e); break;
    //   case 2: console.log('two finger'); break;// handleTwoTouches(e);
    //   case 3: console.log('three finger');  break;// handleThreeTouches(e);
    //   default: console.log("Not supported"); break;
    // }
  }

  const updateSeekTooltipTouch = event => {
    const skipTo = Math.round(
      (event.pageX / sizes.width) * parseInt(maxTimeline, 10),
    )
    setTooltipText(
      moment.unix(startOfDayTs + minTimeline + skipTo).format('LTS'),
    )
    setTooltipLeft(event.pageX)
  }

  const handleSliderChange = event => {
    setSliderValue(Number(event.target.value))
  }

  const handleSliderCommitted = event => {
    const sliderTs = Number(event.target.value) // from 0
    const searchTs = moment.unix(startOfDayTs) + sliderTs + minTimeline

    deviceGetVideoAtTime(searchTs)
  }

  const handleTestChangeTimeline = () => {
    // This doesn't yet work how i want
    //
    setMaxTimeline(86400 / 2)
    // setMinTimeline(86400/4)
    // setSliderValue(86400/4)
    // setStepTimeline] = useState(1) // 1 sec
  }

  return (
    <div
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setTooltipOn(true)}
      onMouseLeave={() => setTooltipOn(false)}
      onTouchCancel={() => setTooltipOn(false)}
      onTouchEnd={() => setTooltipOn(false)}
      onTouchMove={onTouchMove}
      onTouchStart={e => {
        setTooltipOn(true)
        handleTouchStart(e)
      }}
    >
      {resizeListener}
      <div
        id='timeline'
        className={clsx(classes.timelineNewRoot, {
          [classes.userActive]: true, // TESTING userActive,
        })}
      >
        {/* <progress className={classes.progress} id="progress-bar" value={66400} min={0} /> */}

        <button onClick={handleTestChangeTimeline}>Hello</button>
        <div className={classes.filmstrip}>
          <TimeMinimap videoStreamKey={videoStreamKey} streamId={streamId} />
        </div>
        <input
          className={classes.seek}
          id='seek'
          value={sliderValue}
          min={minTimeline}
          type='range'
          step={stepTimeline}
          max={maxTimeline}
          data-title={tooltipText}
          onChange={handleSliderChange}
          onBlur={handleSliderCommitted}
          onMouseUp={handleSliderCommitted}
          onTouchEnd={handleSliderCommitted}
        />
      </div>
      <div
        id='tooltip'
        className={clsx('am-caption', classes.tooltip)}
        style={{ left: tooltipLeft, display: tooltipOn ? 'block' : 'none' }}
      >
        {tooltipText}
      </div>
    </div>
  )
}

Timeline.propTypes = propTypes
Timeline.defaultProps = defaultProps

export default Timeline
