import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import useResizeAware from 'react-resize-aware'
// src
import { fetchFilmstripSnapshotsRequested } from 'redux/slices/videoStreamControls'

import useStyles from './styles'

const propTypes = {
  videoStreamKey: PropTypes.string,
  streamId: PropTypes.string,
}

// This works well for mobile - seems performant.
// However, on localhost laptop, it's weird and doesn't work smoothly.
// If you were to use this for mobile, remove mouse events, and hook it up to video player/ webrtc appliance hooks
const MinimapFilmstrip = ({ videoStreamKey, streamId }) => {
  // FUTURE:  Feature - may make the filmstrip scrollable. 24 images, one per hour. fixed width
  // This would be more for mobile, where on iPhone or iPad, it is scrollable off the screen
  const [resizeListener, sizes] = useResizeAware()
  const [fullWidth, setFullWidth] = useState(sizes.width)
  const [minimapWidth, setMinimapWidth] = useState(null)
  const [minimapLeftX, setMinimapLeftX] = useState(0)
  const [minimapRightX, setMinimapRightX] = useState(0)
  const [isLeftAdjusting, setIsLeftAdjusting] = useState(false) // is user adjusting the size of the left bound
  const [isRightAdjusting, setIsRightAdjusting] = useState(false) // eslint-disable-line
  const classes = useStyles({
    minimapLeftX,
    minimapRightX,
    minimapWidth,
    fullWidth,
  })

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      fetchFilmstripSnapshotsRequested({
        videoStreamKey,
        streamId,
      }),
    )
  }, [dispatch, videoStreamKey, streamId])

  const snapshots = useSelector(state =>
    get(state, `videoStreamControls[${videoStreamKey}].snapshots`),
  )

  // change on resizing
  useEffect(() => {
    if (!isLeftAdjusting || !isRightAdjusting) {
      setFullWidth(sizes.width)
      setMinimapWidth(sizes.width) // this will have to be changed later.
      setMinimapRightX(sizes.width)
    }
  }, [sizes, isLeftAdjusting, isRightAdjusting])

  const minMinutesOfWidth = 240
  const minSecondsOfWidth = minMinutesOfWidth * 60
  const fullTimelineSecondsOfWidth = 86400
  const minWidth = (minSecondsOfWidth / fullTimelineSecondsOfWidth) * fullWidth

  const handleDragOver = e => {
    if (isLeftAdjusting) {
      if (e.screenX > 0) {
        if (e.screenX > minimapRightX - minWidth) {
          setMinimapLeftX(minimapRightX - minWidth)
        } else {
          setMinimapLeftX(e.screenX)
        }
      } else {
        setMinimapLeftX(0)
      }
    }

    if (isRightAdjusting) {
      if (e.screenX < fullWidth) {
        if (e.screenX < minimapLeftX + minWidth) {
          setMinimapRightX(minimapLeftX + minWidth)
        } else {
          setMinimapRightX(e.screenX)
        }
      } else {
        setMinimapRightX(fullWidth)
      }
    }
  }

  useEffect(() => {
    const calcWidth = minimapRightX - minimapLeftX
    if (calcWidth > minWidth) {
      setMinimapWidth(calcWidth)
    } else {
      setMinimapWidth(minWidth)
    }
  }, [minimapRightX, minimapLeftX, minWidth])

  const handleDragOverTouch = e => {
    const touches = e.changedTouches // fingers touching the screen
    if (touches) {
      handleDragOver(touches[0])
    }
  }

  return (
    <div>
      <div className={classes.snapshotContainer}>
        {resizeListener}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {snapshots &&
            snapshots.map((s, i) => (
              <img
                key={`filmstrip-${i}`}
                alt='filmstrip'
                src={s.snapshotUrl}
                className={classes.snapshot}
              />
            ))}
        </div>
      </div>
      <div
        className={classes.dragContainer}
        draggable
        onDragOver={handleDragOver}
        onDrop={handleDragOver}
        onTouchStart={handleDragOverTouch}
        onTouchMove={handleDragOverTouch}
      >
        <div id='minimap-border' className={classes.border} />
        <div
          id='minimap-left-grab'
          className={classes.leftGrab}
          onMouseDown={() => setIsLeftAdjusting(true)}
          onMouseMove={() => setIsLeftAdjusting(true)}
          onMouseOut={() => setIsLeftAdjusting(false)}
          onMouseOver={() => setIsLeftAdjusting(true)}
          onMouseEnter={() => setIsLeftAdjusting(true)}
          onMouseUp={() => setIsLeftAdjusting(false)}
          onMouseLeave={() => setIsLeftAdjusting(false)}
          onTouchEnd={() => setIsLeftAdjusting(false)}
          onTouchStart={() => setIsLeftAdjusting(true)}
        />
        <div
          id='minimap-right-grab'
          className={classes.rightGrab}
          onClick={() => setIsRightAdjusting(true)}
          onMouseDown={() => setIsRightAdjusting(true)}
          onMouseMove={() => setIsRightAdjusting(true)}
          onMouseOut={() => setIsRightAdjusting(false)}
          onMouseOver={() => setIsRightAdjusting(true)}
          onMouseEnter={() => setIsRightAdjusting(true)}
          onMouseUp={() => setIsRightAdjusting(false)}
          onMouseLeave={() => setIsRightAdjusting(false)}
          onTouchEnd={() => setIsRightAdjusting(false)}
          onTouchStart={() => setIsRightAdjusting(true)}
        />
      </div>
    </div>
  )
}

MinimapFilmstrip.propTypes = propTypes
export default MinimapFilmstrip
