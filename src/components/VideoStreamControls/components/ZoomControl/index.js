import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import Slider from 'rc-slider'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import {
  MINUTES_IN_DAY,
  SECONDS_IN_DAY,
} from 'components/VideoStreamControls/constants'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const ZoomControl = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const isZoomIn = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'isZoomIn' }),
  )
  const defaultZoom =
    useSelector(
      getVideoStreamControlsState({ videoStreamKey, property: 'defaultZoom' }),
    ) || 1
  const playPointerPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playPointerPosition',
    }),
  )
  const viewWindowPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'viewWindowPosition',
    }),
  )
  const timelineWidth = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'timelineWidth' }),
  )
  const handleZoom = useCallback(
    val => {
      // const timelineWidth = val === 1 ? SECONDS_IN_DAY : MINUTES_IN_DAY
      const maxSeekBar = val === 1 ? SECONDS_IN_DAY : MINUTES_IN_DAY
      const multiple = val === 1 ? 60 : 1 / 60
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            isZoomIn: val,
            timelineWidth: timelineWidth * multiple,
            maxSeekBar,
            playPointerPosition: playPointerPosition * multiple,
            viewWindowPosition: viewWindowPosition * multiple,
          },
        }),
      )
    },
    [
      dispatch,
      playPointerPosition,
      timelineWidth,
      videoStreamKey,
      viewWindowPosition,
    ],
  )

  return (
    <div className='zoom-controls'>
      <Slider
        vertical
        style={{ marginTop: '-0.5em', height: '40%' }}
        marks={{
          0: {
            label: 'Hrs',
            style: {
              marginLeft: '-2.5em',
              fontSize: '0.7em',
              marginBottom: '-140%',
            },
          },
          1: {
            label: 'Mins',
            style: {
              marginLeft: '-2.5em',
              fontSize: '0.7em',
              marginBottom: '40%',
            },
          },
        }}
        step={1}
        min={0}
        max={1}
        defaultValue={defaultZoom}
        value={isZoomIn}
        onChange={handleZoom}
      />
    </div>
  )
}

ZoomControl.propTypes = propTypes

export default ZoomControl
