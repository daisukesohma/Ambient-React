import React, { useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import Slider from 'rc-slider'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'

import tsToSliderPosition from '../../utils/tsToSliderPosition'
import unixTimeHasData from '../../utils/unixTimeHasData'
import {
  SECONDS_IN_HOUR,
  MINUTES_IN_HOUR,
  HOURS_IN_DAY,
  MINUTES_IN_DAY,
  SECONDS_IN_DAY,
  MIN_ENTITY_DOC_COUNT,
} from '../../constants'

import SliderHandle from './components/SliderHandle'
import { msToUnix } from '../../../../utils'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
}

const TimelineScroll = ({ videoStreamKey, timezone }) => {
  const svgSliderContainer = useRef(null)
  const dispatch = useDispatch()
  const isZoomIn = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'isZoomIn' }),
  )
  const catalogue = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'catalogue' }),
  )
  const playPointerPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playPointerPosition',
    }),
  )
  const maxSeekBar = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'maxSeekBar' }),
  )
  const viewWindowPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'viewWindowPosition',
    }),
  )
  const subtractDays = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'subtractDays' }),
  )
  const selectedEntities = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'selectedEntities',
    }),
  )
  const metadata = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'metadata' }),
  )
  const tsTimelineHighlight = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'tsTimelineHighlight',
    }),
  )

  const createSliderMarks = useMemo(() => {
    const marks = {}
    const incrementAmt = isZoomIn === 1 ? SECONDS_IN_HOUR : MINUTES_IN_HOUR
    for (let i = 0; i <= HOURS_IN_DAY; i += 2) {
      marks[i * incrementAmt] = {
        style: {
          fontSize: '0.7em',
        },
        label: `${i}:00`,
      }
    }

    // indicator for playhead
    marks[playPointerPosition] = {
      style: {
        color: '#ed5565',
        fontSize: '0.7em',
        marginTop: '-0.7em',
      },
      label: <i className='fa fa-sort-up' />,
    }

    return marks
  }, [playPointerPosition, isZoomIn])

  const stopDragging = () => {
    //
  }

  const handleViewWindowSlider = useCallback(
    value => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            viewWindowPosition: value * -1,
          },
        }),
      )
    },
    [dispatch, videoStreamKey],
  )

  const renderSVGSliderMarkers = useMemo(() => {
    const sliderMarkers = []
    if (catalogue) {
      const filtered = catalogue

      let curr
      // let currWidth;
      let currX = 0
      let max

      for (let i = 0; i < filtered.length; ++i) {
        curr = filtered[i]

        if (isZoomIn === 0) {
          max = 1440
        } else {
          max = 86400
        }

        currX = msToUnix(curr.startTs) - tsAtMidnight(-subtractDays, timezone)

        if (isZoomIn === 0) {
          // currWidth /= 60;
          currX /= 60
          max = 1440
        } else {
          max = 86400
        }

        if (currX && currX <= max) {
          // eslint-disable-line
          const sliderX = tsToSliderPosition(
            msToUnix(curr.startTs),
            subtractDays,
          )
          sliderMarkers.push(
            <circle
              key={`circle-${sliderX}`}
              className='datapoint slider-marker'
              cx={`${sliderX}%`}
              fill='#337ab7'
              r='5'
              cy='15'
            />,
          )
        }
      }
    }
    // Renders the entity markers
    if (selectedEntities.length > 0) {
      let curr
      let currX = 0
      let max
      let filtered

      // TODO: Need to handle when different metadata entities are displayed --> Intersection Search
      for (let k = 0; k < metadata.length; ++k) {
        filtered = metadata[k].aggregations.byTimeUnit.buckets
        for (let i = 0; i < filtered.length; ++i) {
          curr = filtered[i]

          const keyTs = msToUnix(curr.key)

          currX = keyTs - tsAtMidnight(-subtractDays, timezone)

          // This is to set the largest most point of the timeline to be 1440 (number of minutes in a day) vs 86400 (number of seconds in a day)
          // Divides current X by 60 if not zoomed in since currX is in seconds and want to view currX in minutes
          if (isZoomIn === 0) {
            currX /= 60
            max = 1440
          } else {
            max = 86400
          }

          if (
            unixTimeHasData(keyTs, catalogue) &&
            curr.docCount >= MIN_ENTITY_DOC_COUNT &&
            currX <= max &&
            !isNaN(currX) // eslint-disable-line
          ) {
            const sliderX = tsToSliderPosition(keyTs, subtractDays)
            sliderMarkers.push(
              <circle
                className='datapoint slider-marker'
                cx={`${sliderX}%`}
                fill='pink'
                r='5'
                cy='5'
              />,
            )
          }
        }
      }
    }

    if (tsTimelineHighlight) {
      const tsTimelineHighlightNum = Number(tsTimelineHighlight)

      let highlightX =
        tsTimelineHighlightNum - tsAtMidnight(-subtractDays, timezone)
      let max

      // This is to set the largest most point of the timeline to be 1440 (number of minutes in a day) vs 86400 (number of seconds in a day)
      if (isZoomIn === 0) {
        highlightX /= MINUTES_IN_HOUR
        max = MINUTES_IN_DAY
      } else {
        max = SECONDS_IN_DAY
      }
      if (
        unixTimeHasData(tsTimelineHighlightNum) &&
        highlightX <= max &&
        !highlightX // eslint-disable-line
      ) {
        const sliderX = tsToSliderPosition(tsTimelineHighlightNum, subtractDays)
        sliderMarkers.push(
          <circle
            className='datapoint slider-marker highlight'
            cx={`${sliderX}%`}
            fill='#FFC803'
            r='5'
            cy='5'
          />,
        )
      }
    }
    return sliderMarkers
  }, [
    catalogue,
    isZoomIn,
    metadata,
    selectedEntities.length,
    subtractDays,
    tsTimelineHighlight,
    timezone,
  ])

  return (
    <div style={{ width: '100%' }}>
      <svg
        ref={svgSliderContainer}
        width='100%'
        height='20'
        className='svg-slider-container'
      >
        <g>{renderSVGSliderMarkers}</g>
      </svg>
      <Slider
        handle={SliderHandle}
        marks={createSliderMarks}
        tipFormatter={val => `${val}`}
        tipProps={{
          placement: 'top',
          prefixCls: 'rc-slider-tooltip',
        }}
        min={0}
        max={maxSeekBar}
        defaultValue={3}
        value={Math.abs(viewWindowPosition)}
        onAfterChange={stopDragging}
        onChange={handleViewWindowSlider}
      />
    </div>
  )
}

TimelineScroll.propTypes = propTypes

export default TimelineScroll
