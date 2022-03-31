import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import get from 'lodash/get'
// import { useDispatch } from 'react-redux'
import { animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
// import {
//   setDraggingState,
// } from 'redux/slices/videoStreamControls'

import TimelineSvg from '../TimelineSvg'
import useWindowSize from 'common/hooks/useWindowSize'

import useStyles from './styles'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  getMetadata: PropTypes.func,
  initTs: PropTypes.any,
  nodeId: PropTypes.any,
  streamId: PropTypes.any,
  timezone: PropTypes.string,
  videoStreamKey: PropTypes.string,
}

const defaultProps = {
  timezone: DEFAULT_TIMEZONE,
}

const AnimatedTimeline = ({
  accountSlug,
  siteSlug,
  getMetadata,
  initTs,
  nodeId,
  streamId,
  timezone,
  videoStreamKey,
}) => {
  // const dispatch = useDispatch()
  const classes = useStyles()
  const [hoverX, setHoverX] = useState(0)
  // const [dragX, setDragX] = useState(0)
  const [clickX, setClickX] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  // const isDragging = useRef(false)
  const dragDeltaTime = React.useRef(0)

  const enterLeaveTimeline = hovering => {
    if (hovering) {
      setIsHovering(true)
    } else {
      setIsHovering(false)
    }
  }

  // Differentiate between onDrag and onClick, using dragDeltaTime
  // https://github.com/pmndrs/react-use-gesture/issues/66
  // https://codesandbox.io/s/crazy-solomon-dtpts // single click (being used rn)
  // https://codesandbox.io/s/hardcore-kowalevski-kepmr // double click implementation (unused)
  //
  const bind = useGesture({
    // onDrag: ({ down, delta: [dx], first, last, timeStamp }) => {
    //   dispatch(setDraggingState({ videoStreamKey, isDragging: true}))
    //   if (first && timeStamp) {
    //     dragDeltaTime.current = timeStamp
    //     isDragging.current = true
    //   } else if (last && timeStamp) {
    //     dragDeltaTime.current = timeStamp - dragDeltaTime.current
    //     requestAnimationFrame(() => {
    //       isDragging.current = false
    //     })
    //   }
    //   if (down) setDragX(dx)
    //   dispatch(setDraggingState({ videoStreamKey, isDragging: false}))
    // },
    onMove: ({ values: [vx] }) => setHoverX(vx),
    onHover: ({ hovering }) => {
      enterLeaveTimeline(hovering)
    },
    onClick: e => {
      e.stopPropagation()
      // if drag time is under 180ms, then set the clickX
      if (dragDeltaTime.current < 180) {
        setClickX(hoverX)
      }
      dragDeltaTime.current = 0
    },
  })

  const animatedDiv = useRef(null)
  const animatedDivSize = useWindowSize(animatedDiv)

  return (
    <animated.div
      ref={animatedDiv}
      className={clsx(classes.controlsRoot, {
        [classes.userActive]: true, // userActive,
      })}
      {...bind()}
      style={{ touchAction: 'pan-y' }}
    >
      <TimelineSvg
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        clickX={clickX}
        resetClickX={() => setClickX(null)}
        controlledTime={false}
        // dragX={dragX}
        generateNewData={false}
        getMetadata={getMetadata}
        hoverX={hoverX}
        initTs={initTs}
        isHovering={isHovering}
        nodeId={nodeId}
        streamId={streamId}
        timezone={timezone}
        videoStreamKey={videoStreamKey}
        widthPx={get(animatedDivSize, '[1]', 0)}
      />
    </animated.div>
  )
}

AnimatedTimeline.propTypes = propTypes
AnimatedTimeline.defaultProps = defaultProps

export default AnimatedTimeline
