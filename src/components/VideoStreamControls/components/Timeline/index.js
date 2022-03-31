/* eslint-disable no-restricted-globals */
import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch, batch } from 'react-redux'
// src
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import { getCurrUnixTimestamp } from 'utils'
import { createNotification } from 'redux/slices/notifications'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { useVideoCommands } from 'common/hooks/video'

import Tooltip from '../../../Tooltip'
import TooltipText from '../../../Tooltip/TooltipText'
import formatUnixTimeToReadable from '../../utils/formatUnixTimeToReadable'
import tsAtMidnight from '../../utils/tsAtMidnight'
import withinNonMotionRetentionDuration from '../../utils/withinNonMotionRetentionDuration'
import dataFromTS from '../../utils/dataFromTS'
import 'rc-slider/assets/index.css'
import './index.css'
import {
  MIN_ENTITY_DOC_COUNT,
  WIDTH_OF_ENTITY_MARKER_HRS,
  WIDTH_OF_ENTITY_MARKER_MIN,
  MINUTES_IN_DAY,
  SECONDS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from '../../constants'
import convertMinutesToTime from '../../utils/convertMinutesToTime'
import convertSecondsToTime from '../../utils/convertSecondsToTime'
import { msToUnix } from '../../../../utils'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const Timeline = ({ videoStreamKey }) => {
  const { deviceGetVideoAtTime } = useVideoCommands({ videoStreamKey })
  const nowTs = getCurrUnixTimestamp()
  const dispatch = useDispatch()
  const timelineContainer = useRef()
  const svgContainerRef = useRef()
  const selectedElementRef = useRef()
  const offsetRef = useRef(null)
  const svgPtRef = useRef()

  // const streamState = useSelector(getStreamFeedData({videoStreamKey, property: 'state'}))

  const isZoomIn = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'isZoomIn' }),
  )
  const videoStreamTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'videoStreamTS' }),
  )
  const subtractDays = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'subtractDays' }),
  )
  const retention = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'retention' }),
  )
  const catalogue = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'catalogue' }),
  )
  const tsTimelineHighlight = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'initTs',
    }),
  )
  const clipLeftPositionTS = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'clipLeftPositionTS',
    }),
  )
  const clipRightPositionTS = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'clipRightPositionTS',
    }),
  )
  const clipLeftPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'clipLeftPosition',
    }),
  )
  const clipRightPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'clipRightPosition',
    }),
  )
  const metadata = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'metadata' }),
  )
  const xAxisIncrements = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'xAxisIncrements',
    }),
  )
  const isHoveringOnTimeline = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'isHoveringOnTimeline',
    }),
  )
  const clipWidth = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'clipWidth' }),
  )
  const initClipControlsPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'initClipControlsPosition',
    }),
  )
  const timelineWidth = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'timelineWidth' }),
  )
  const hasData = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'hasData' }),
  )
  const thumbnailDate = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'thumbnailDate' }),
  )
  const dragging = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'dragging' }),
  )
  const message = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'message' }),
  )
  const displayMessage = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'displayMessage' }),
  )
  const exportMode = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'exportMode' }),
  )
  const loadingArchivalVideo = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'loadingArchivalVideo',
    }),
  )
  const viewWindowPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'viewWindowPosition',
    }),
  )
  const hoverIndicatorX = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'hoverIndicatorX',
    }),
  )
  const playPointerPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playPointerPosition',
    }),
  )
  const selectedEntities = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'selectedEntities',
    }),
  )

  useEffect(() => {
    svgPtRef.current = svgContainerRef.current.createSVGPoint()
  }, [])

  /* Clip Controls methods */
  const displayClipControls = () => {
    let newViewWindowPosition
    if (isZoomIn === 1) {
      newViewWindowPosition = viewWindowPosition
    } else {
      newViewWindowPosition = viewWindowPosition * 60
    }

    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          clipLeftPosition: 0,
          clipRightPosition: 20,
          clipWidth: 20,
          clipLeftPositionTS:
            Math.abs(newViewWindowPosition) + 60 + tsAtMidnight(),
          clipRightPositionTS:
            Math.abs(newViewWindowPosition) + 60 + tsAtMidnight() + 20,
          exportStartTS: Math.abs(newViewWindowPosition) + 60 + tsAtMidnight(),
          exportEndTS:
            Math.abs(newViewWindowPosition) + 60 + tsAtMidnight() + 20,
          initClipControlsPosition: Math.abs(newViewWindowPosition) + 60,
        },
      }),
    )
  }

  useEffect(() => {
    displayClipControls()
    // eslint-disable-next-line
  }, [exportMode])

  const getMousePosition = useCallback(event => {
    const CTM = svgContainerRef.current.getScreenCTM()
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d,
    }
  }, [])

  const getMouseCoordinatesWithinSvg = useCallback(event => {
    svgPtRef.current.x = event.clientX
    svgPtRef.current.y = event.clientY
    return svgPtRef.current.matrixTransform(
      svgContainerRef.current.getScreenCTM().inverse(),
    )
  }, [])

  const getTimestampOfMouse = useCallback(
    cursorPt => {
      let cursorPtX
      let newViewWindowPosition
      if (isZoomIn) {
        newViewWindowPosition = Math.abs(viewWindowPosition)
        cursorPtX = cursorPt.x
      } else {
        newViewWindowPosition = Math.abs(viewWindowPosition * 60)
        cursorPtX = cursorPt.x * 60
      }
      return (
        newViewWindowPosition +
        (tsAtMidnight() - 3600 * 24 * subtractDays) +
        cursorPtX
      )
    },
    [isZoomIn, subtractDays, viewWindowPosition],
  )

  const drag = useCallback(
    event => {
      if (selectedElementRef.current) {
        event.preventDefault()
        const coord = getMousePosition(event)
        const cursorPt = getMouseCoordinatesWithinSvg(event)
        const unixTs = getTimestampOfMouse(cursorPt)
        let valid = false
        const newPosition = coord.x - offsetRef.current.x
        let newClipWidth
        if (
          selectedElementRef.current.id === 'clipRightPosition' &&
          newPosition > clipLeftPosition
        ) {
          newClipWidth = newPosition - clipLeftPosition
          valid = true
        } else if (
          selectedElementRef.current.id === 'clipLeftPosition' &&
          newPosition < clipRightPosition
        ) {
          newClipWidth = clipRightPosition - newPosition
          valid = true
        }
        if (valid) {
          dispatch(
            setVideoStreamValues({
              videoStreamKey,
              props: {
                clipWidth: newClipWidth,
                [selectedElementRef.current.id]: newPosition,
                [`${selectedElementRef.current.id}TS`]: unixTs,
              },
            }),
          )
        }
      }
    },
    [
      clipLeftPosition,
      clipRightPosition,
      dispatch,
      getMouseCoordinatesWithinSvg,
      getMousePosition,
      getTimestampOfMouse,
      videoStreamKey,
    ],
  )

  const endDrag = useCallback(
    event => {
      selectedElementRef.current = null
      window.removeEventListener('mouseup', endDrag)
      window.removeEventListener('mousemove', drag)
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            exportStartTS: clipLeftPositionTS,
            exportEndTS: clipRightPositionTS,
          },
        }),
      )
    },
    [drag, dispatch, clipLeftPositionTS, clipRightPositionTS, videoStreamKey],
  )

  const startDrag = useCallback(
    e => {
      selectedElementRef.current = e.target
      offsetRef.current = getMousePosition(e)
      if (selectedElementRef.current.id === 'clipRightPosition') {
        offsetRef.current.x -= parseFloat(clipRightPosition)
      } else {
        offsetRef.current.x -= parseFloat(clipLeftPosition)
      }
      window.addEventListener('mouseup', endDrag)
      window.addEventListener('mousemove', drag)
    },
    [drag, endDrag, getMousePosition, clipRightPosition, clipLeftPosition],
  )

  const filterCatalogue = useCallback(
    selectedTS => {
      let startTS
      let endTS
      if (isZoomIn === 1) {
        startTS = selectedTS - SECONDS_IN_HOUR * 3
        endTS = selectedTS + SECONDS_IN_HOUR * 3
      } else {
        startTS = selectedTS - SECONDS_IN_HOUR * 10
        endTS = selectedTS + SECONDS_IN_HOUR * 10
      }
      if (catalogue.length > 0) {
        return catalogue.filter(el => {
          // get only elements in the catalogue that are within the 3 hour range
          return msToUnix(el.endTs) >= startTS && msToUnix(el.startTs) <= endTS
        })
      }
      return []
    },
    [catalogue, isZoomIn],
  )

  const unixTimeHasData = useCallback(
    unixTs => {
      return !!dataFromTS(catalogue, unixTs).el
    },
    [catalogue],
  )

  const renderTimelineMarkers = useMemo(() => {
    const markers = []

    // Renders the non motion marker
    // Check if current day selected is today (subtractDays === 0)
    const nonMotionTs =
      subtractDays > 0 ? tsAtMidnight(subtractDays - 1) : nowTs
    if (
      withinNonMotionRetentionDuration(
        nonMotionTs,
        retention.nonmotionSegmentRetentionDays,
      )
    ) {
      let nonMotionX = 0
      let nonmotionWidth = subtractDays > 0 ? 86400 : nowTs - tsAtMidnight()
      if (subtractDays === 0) {
        // If it is current day
        nonmotionWidth = nowTs - tsAtMidnight()
      } else if (subtractDays === retention.nonmotionSegmentRetentionDays) {
        // Check to see if subtractDays is last day in retention
        nonMotionX = nowTs - tsAtMidnight()
        nonmotionWidth = 86400 - nonMotionX
      } else {
        // If it is not the current day or the last retention day, then whole day is available to click
        nonmotionWidth = 86400
      }

      if (isZoomIn === 0) {
        nonmotionWidth /= 60
        nonMotionX /= 60
      }

      const nonmotionStartTs = tsAtMidnight(subtractDays)
      const nonmotionEndTs = subtractDays > 0 ? nonmotionStartTs + 86400 : nowTs

      markers.push(
        <rect
          key={`marker-${nonmotionStartTs}`}
          className='datapoint nonmotion'
          rx='3'
          data-readable-start={formatUnixTimeToReadable(
            nonmotionStartTs,
            true,
            true,
          )}
          data-readable-end={formatUnixTimeToReadable(
            nonmotionEndTs,
            true,
            true,
          )}
          data-startts={nonmotionStartTs}
          data-endts={nonmotionEndTs}
          fill='#0ABFFC'
          fillOpacity='0.4'
          height='20'
          width={`${nonmotionWidth}`}
          y='0'
          x='-1'
          transform={`translate(${nonMotionX})`}
        />,
      )
    }

    // Render the catalogue markers if there is catalogue
    if (catalogue) {
      const newViewWindowPosition =
        isZoomIn === 1 ? viewWindowPosition : viewWindowPosition * 60
      const filtered = filterCatalogue(
        Math.abs(newViewWindowPosition) + tsAtMidnight(subtractDays),
      )

      let curr
      let currWidth
      let currX = 0
      let max

      for (let i = 0; i < filtered.length; ++i) {
        curr = filtered[i]

        if (isZoomIn === 0) {
          max = MINUTES_IN_DAY
        } else {
          max = SECONDS_IN_DAY
        }

        if (subtractDays > 0) {
          currWidth = Math.min(
            msToUnix(curr.endTs - curr.startTs),
            msToUnix(tsAtMidnight(subtractDays - 1) - curr.startTs),
          )
        } else if (subtractDays === 0) {
          currWidth = Math.min(
            msToUnix(curr.endTs - curr.startTs),
            msToUnix(nowTs - curr.startTs),
          )
        }

        currX = msToUnix(curr.startTs) - tsAtMidnight(subtractDays)

        if (isZoomIn === 0) {
          currWidth /= MINUTES_IN_HOUR
          currX /= MINUTES_IN_HOUR
          max = MINUTES_IN_DAY
        } else {
          max = SECONDS_IN_DAY
        }

        if (currX <= max && !isNaN(currX)) {
          // eslint-disable-line
          markers.push(
            <rect
              key={`marker-${curr.startTs}`}
              className='datapoint catalogue'
              rx='3'
              data-readable-start={formatUnixTimeToReadable(
                msToUnix(curr.startTs),
                true,
                true,
              )}
              data-readable-end={formatUnixTimeToReadable(
                msToUnix(curr.endTs),
                true,
                true,
              )}
              data-startts={msToUnix(curr.startTs)}
              data-endts={msToUnix(curr.endTs)}
              fill='#337ab7'
              fillOpacity='0.5'
              height='10'
              width={`${currWidth}`}
              x='-1'
              transform={`translate(${currX})`}
            />,
          )
        }
      }
    }

    // Renders the entity markers
    if (selectedEntities && selectedEntities.length > 0) {
      let curr
      let currWidth
      let currX = 0
      let max
      let filtered

      // TODO: Need to handle when different metadata entities are displayed --> Intersection Search
      for (let k = 0; k < metadata.length; ++k) {
        filtered = metadata[k].aggregations.byTimeUnit.buckets
        for (let i = 0; i < filtered.length; ++i) {
          curr = filtered[i]
          const keyTs = msToUnix(curr.key)

          currX = keyTs - tsAtMidnight(subtractDays)

          // This is to set the largest most point of the timeline to be 1440 (number of minutes in a day) vs 86400 (number of seconds in a day)
          // Divides current X by 60 if not zoomed in since currX is in seconds and want to view currX in minutes
          if (isZoomIn === 0) {
            currX /= 60
            max = MINUTES_IN_DAY
            // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
            if (subtractDays >= 0) {
              currWidth = WIDTH_OF_ENTITY_MARKER_HRS
            }
          } else {
            max = SECONDS_IN_DAY
            // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
            if (subtractDays >= 0) {
              currWidth = WIDTH_OF_ENTITY_MARKER_MIN
            }
          }

          if (
            unixTimeHasData(keyTs) &&
            curr.docCount >= MIN_ENTITY_DOC_COUNT &&
            currX <= max &&
            !isNaN(currX) // eslint-disable-line
          ) {
            // eslint-disable-line
            markers.push(
              <rect
                key={`marker-${keyTs}`}
                className='datapoint metadata'
                rx='3'
                data-readable-start={formatUnixTimeToReadable(
                  keyTs,
                  true,
                  true,
                )}
                data-readable-end={formatUnixTimeToReadable(keyTs, true, true)}
                data-startts={keyTs}
                data-endts={keyTs}
                fill='pink'
                fillOpacity='0.8'
                height='10'
                width={`${currWidth}`}
                x='-1'
                transform={`translate(${currX})`}
              />,
            )
          }
        }
      }
    }

    // Render Timeline Highlight
    if (tsTimelineHighlight) {
      const highlightTs = Number(tsTimelineHighlight)
      let highlightX = highlightTs - tsAtMidnight(subtractDays)
      let maxTimeline
      let highlightWidth
      if (isZoomIn === 0) {
        highlightX /= 60
        maxTimeline = MINUTES_IN_DAY
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
        if (subtractDays >= 0) {
          highlightWidth = WIDTH_OF_ENTITY_MARKER_HRS
        }
      } else {
        maxTimeline = SECONDS_IN_DAY
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
        if (subtractDays >= 0) {
          highlightWidth = WIDTH_OF_ENTITY_MARKER_MIN
        }
      }
      if (
        unixTimeHasData(highlightTs) &&
        highlightX <= maxTimeline &&
        !isNaN(highlightX) // eslint-disable-line
      ) {
        // eslint-disable-line
        markers.push(
          <rect
            className='datapoint metadata highlight'
            rx='3'
            data-readable-start={formatUnixTimeToReadable(
              highlightTs,
              true,
              true,
            )}
            data-readable-end={formatUnixTimeToReadable(
              highlightTs,
              true,
              true,
            )}
            data-startts={highlightTs}
            data-endts={highlightTs}
            fill='#FFC803'
            fillOpacity='0.8'
            height='10'
            width={`${highlightWidth}`}
            x='-1'
            transform={`translate(${highlightX})`}
          />,
        )
      }
    }

    return (
      <g className='datapoints' transform='translate(0)'>
        {markers}
      </g>
    )
  }, [
    catalogue,
    filterCatalogue,
    isZoomIn,
    metadata,
    nowTs,
    retention.nonmotionSegmentRetentionDays,
    selectedEntities,
    subtractDays,
    tsTimelineHighlight,
    unixTimeHasData,
    viewWindowPosition,
  ])

  const renderXAxisMarkers = useMemo(() => {
    // need to see what time window is and change index based on viewWindowPosition
    const markers = []
    let lowestMultiple
    let largestMultiple
    if (isZoomIn === 1) {
      const minTime =
        Math.abs(Math.floor(viewWindowPosition)) - xAxisIncrements * 0 // 15 min time window
      const maxTime =
        Math.abs(Math.floor(viewWindowPosition)) + xAxisIncrements * 30

      // get lowest multiple of 5 within time range
      for (let i = minTime; i <= maxTime; ++i) {
        if (i % xAxisIncrements === 0) {
          lowestMultiple = i
          break
        }
      }

      for (let i = maxTime; i >= minTime; --i) {
        if (i % xAxisIncrements === 0) {
          largestMultiple = i
          break
        }
      }
    } else {
      lowestMultiple = 0
      largestMultiple = MINUTES_IN_DAY
    }

    let tsAtLocation
    let unixTS
    let isZoomOut

    for (let i = lowestMultiple; i <= largestMultiple; i += xAxisIncrements) {
      if (isZoomIn === 1) {
        unixTS = i + tsAtMidnight()
        isZoomOut = false
      } else {
        unixTS = i * SECONDS_IN_MINUTE + tsAtMidnight()
        isZoomOut = true
      }
      tsAtLocation = formatUnixTimeToReadable(unixTS, false, true, isZoomOut)

      markers.push(
        <g
          key={i}
          className='tick'
          opacity='1'
          transform={`translate(${i}, -30)`}
        >
          <line stroke='#676a6c' y2='18' />
          <text y='20' dy='0.71em' fill='#676a6c'>
            {tsAtLocation}
          </text>
        </g>,
      )
    }

    return (
      <g
        className='x-axis'
        transform='translate(0, 60)'
        fill='none'
        fontSize='10'
        textAnchor='middle'
      >
        <path className='domain' stroke='#000' d='M0.5,18V0.5H758.5V18' />
        {markers}
      </g>
    )
  }, [isZoomIn, viewWindowPosition, xAxisIncrements])

  const onMouseUp = useCallback(
    event => {
      window.removeEventListener('mouseup', onMouseUp)
      if (catalogue) {
        const cursorPt = getMouseCoordinatesWithinSvg(event)
        const unixTs = getTimestampOfMouse(cursorPt)
        const currentCatalogue = dataFromTS(catalogue, unixTs)
        if (
          currentCatalogue.el ||
          withinNonMotionRetentionDuration(
            unixTs,
            retention.nonmotionSegmentRetentionDays,
          )
        ) {
          const svgContainerBoundingBox = svgContainerRef.current.getBoundingClientRect()
          let newPlaypointerPosition
          if (isZoomIn) {
            newPlaypointerPosition =
              event.clientX -
              svgContainerBoundingBox.left +
              Math.abs(viewWindowPosition)
          } else {
            newPlaypointerPosition =
              event.clientX -
              svgContainerBoundingBox.left +
              Math.abs(viewWindowPosition)
          }

          batch(() => {
            dispatch(
              setVideoStreamValues({
                videoStreamKey,
                props: {
                  playPointerPosition: newPlaypointerPosition,
                  currentCatalogPlaying: currentCatalogue,
                  videoStreamTS: unixTs,
                },
              }),
            )

            deviceGetVideoAtTime(unixTs)
          })
        } else {
          dispatch(createNotification({ message: 'No Recorded Data' }))
        }
      } else {
        dispatch(createNotification({ message: 'No Recorded Data' }))
      }
    },
    [
      catalogue,
      dispatch,
      deviceGetVideoAtTime,
      getMouseCoordinatesWithinSvg,
      getTimestampOfMouse,
      isZoomIn,
      videoStreamKey,
      viewWindowPosition,
      retention.nonmotionSegmentRetentionDays,
    ],
  )

  const onMouseDown = useCallback(
    event => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            isFollowing: false,
          },
        }),
      )
      window.addEventListener('mouseup', onMouseUp)
    },
    [dispatch, onMouseUp, videoStreamKey],
  )

  const onMouseLeave = useCallback(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          isHoveringOnTimeline: false,
        },
      }),
    )
  }, [dispatch, videoStreamKey])

  // used to get the timestamp of a click or hover event
  const onTimelineHover = useCallback(
    event => {
      const cursorPt = getMouseCoordinatesWithinSvg(event)
      const unixTs = getTimestampOfMouse(cursorPt)
      const readableDate = formatUnixTimeToReadable(unixTs, false, true)

      const svgContainerBoundingBox = svgContainerRef.current.getBoundingClientRect()
      const newHoverIndicatorX =
        event.clientX - svgContainerBoundingBox.left + viewWindowPosition * -1

      const props = {
        isHoveringOnTimeline: true,
        thumbnailDate: readableDate,
        hoverIndicatorX: newHoverIndicatorX,
      }

      if (catalogue) {
        props.hasData =
          unixTimeHasData(unixTs) ||
          withinNonMotionRetentionDuration(
            unixTs,
            retention.nonmotionSegmentRetentionDays,
          )
      }

      dispatch(setVideoStreamValues({ videoStreamKey, props }))
    },
    [
      dispatch,
      catalogue,
      getTimestampOfMouse,
      unixTimeHasData,
      videoStreamKey,
      viewWindowPosition,
      getMouseCoordinatesWithinSvg,
      retention.nonmotionSegmentRetentionDays,
    ],
  )

  const getSvgWidth = useCallback(() => {
    // eslint-disable-line
    if (svgContainerRef.current) {
      const boundingRect = svgContainerRef.current.getBoundingClientRect()
      return boundingRect.width
    }

    return null
  }, [svgContainerRef])

  const hasDataDisplay = useMemo(() => {
    if (loadingArchivalVideo) return 'Loading Archival Video...'
    if (hasData) return 'Recorded Data'
    return 'No Recorded Data'
  }, [loadingArchivalVideo, hasData])

  const clipLeftPositionDisplay = useMemo(
    () =>
      clipLeftPositionTS
        ? formatUnixTimeToReadable(clipLeftPositionTS, false, true, !isZoomIn)
        : null,
    [clipLeftPositionTS, isZoomIn],
  )

  const clipRightPositionDisplay = useMemo(
    () =>
      clipRightPositionTS
        ? formatUnixTimeToReadable(clipRightPositionTS, false, true, !isZoomIn)
        : null,
    [clipRightPositionTS, isZoomIn],
  )

  // TODO: need to figure out how to set clipLocation
  const renderClipControl = useMemo(() => {
    return exportMode ? (
      <g
        className='clip'
        transform={`translate(${initClipControlsPosition}, 0)`}
      >
        <g className='clip-selector'>
          <rect
            className='selection'
            height='40'
            fill='#1ab394'
            opacity='0.6'
            x={`${clipLeftPosition}`}
            width={`${clipWidth}`}
          />
          <g className='left' transform={`translate(${clipLeftPosition}, 0)`}>
            <rect
              id='clipLeftPosition'
              onMouseDown={startDrag}
              className='handle draggable '
              rx='3'
              ry='3'
              width='16'
              transform='translate(-16,0)'
              height='40'
              fill='#1ab394'
            />
            <rect
              className='dragable line'
              transform='translate(-1)'
              height='40'
              fill='#10a580'
              width='1'
            />
            <rect
              className='dragable grabLine'
              fill='white'
              transform='translate(-14, 5)'
              width='1'
              height='30'
            />
          </g>
          <g className='right' transform={`translate(${clipRightPosition}, 0)`}>
            <rect
              id='clipRightPosition'
              onMouseDown={startDrag}
              className='handle draggable '
              rx='3'
              ry='3'
              width='16'
              height='40'
              fill='#1ab394'
            />
            <rect
              className='dragable line'
              transform='translate(-1)'
              height='40'
              fill='#10a580'
              width='1'
            />
            <rect
              className='dragable grabLine'
              fill='white'
              transform='translate(13, 5)'
              width='1'
              height='30'
            />
          </g>
          <rect
            className='playpointer-time'
            fill='#f2f2f2'
            width='46'
            opacity='0.5'
            height='1em'
            x={`${clipLeftPosition}`}
            transform='translate(-22,41)'
          />
          <text
            className='start label time'
            textAnchor='middle'
            height='22'
            dy='50'
            fill='#676a6c'
            fontSize='12'
            x={`${clipLeftPosition}`}
          >
            {clipLeftPositionDisplay}
          </text>
          <rect
            className='playpointer-time'
            fill='#f2f2f2'
            width='46'
            opacity='0.5'
            height='1em'
            x={`${clipRightPosition}`}
            transform='translate(-22,41)'
          />
          <text
            className='end label time'
            textAnchor='middle'
            height='22'
            dy='50'
            fill='#676a6c'
            fontSize='12'
            x={`${clipRightPosition}`}
          >
            {clipRightPositionDisplay}
          </text>
        </g>
      </g>
    ) : null
  }, [
    clipLeftPosition,
    clipLeftPositionDisplay,
    clipRightPosition,
    clipRightPositionDisplay,
    clipWidth,
    exportMode,
    initClipControlsPosition,
    startDrag,
  ])

  const [leftEdgeEffectX, rightEdgeEffectX] = useMemo(() => {
    if (viewWindowPosition > 0) {
      return [viewWindowPosition * -1, getSvgWidth() - 10 - viewWindowPosition]
    }
    return [
      Math.abs(viewWindowPosition),
      Math.abs(viewWindowPosition) + getSvgWidth() - 10,
    ]
  }, [getSvgWidth, viewWindowPosition])

  const [displayTooltip, displayTooltipContent] = useMemo(() => {
    let displayStatus
    let content
    if (isHoveringOnTimeline) {
      displayStatus = true
      content = (
        <TooltipText>
          <span id='timeline-display-tooltip'>
            {thumbnailDate} -{hasDataDisplay}
          </span>
        </TooltipText>
      )
    } else if (dragging) {
      displayStatus = true
      const svgContainerBoundingBox = svgContainerRef.current.getBoundingClientRect()
      const startRange = Math.abs(viewWindowPosition)
      const endRange = startRange + Math.floor(svgContainerBoundingBox.width)

      if (isZoomIn === 1) {
        content = (
          <TooltipText>
            Time Range: {convertSecondsToTime(startRange)} -{' '}
            {convertSecondsToTime(endRange)}
          </TooltipText>
        )
      } else {
        content = (
          <TooltipText>
            Time Range: {convertMinutesToTime(startRange)} -{' '}
            {convertMinutesToTime(endRange)}
          </TooltipText>
        )
      }
    } else if (displayMessage) {
      displayStatus = true
      content = <TooltipText>{message}</TooltipText>
    } else {
      displayStatus = false
    }
    return [displayStatus, content]
  }, [
    displayMessage,
    dragging,
    hasDataDisplay,
    isHoveringOnTimeline,
    isZoomIn,
    message,
    thumbnailDate,
    viewWindowPosition,
  ])

  const readableTSPlaying = useMemo(() => {
    return isNaN(videoStreamTS) // eslint-disable-line
      ? formatUnixTimeToReadable(nowTs, false, true)
      : formatUnixTimeToReadable(videoStreamTS, false, true) // eslint-disable-line
  }, [videoStreamTS, nowTs])

  const renderGradient = useMemo(
    () => (
      <defs>
        <linearGradient id='leftEdge'>
          <stop offset='0%' stopColor='white' stopOpacity='1' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </linearGradient>
        <linearGradient id='rightEdge'>
          <stop offset='0%' stopColor='white' stopOpacity='0' />
          <stop offset='100%' stopColor='white' stopOpacity='1' />
        </linearGradient>
      </defs>
    ),
    [],
  )

  const renderPlayPointerGroup = useMemo(
    () => (
      <g className='playpointer-group'>
        <g
          className='playpointer'
          transform={`translate(${playPointerPosition}, -30)`}
        >
          <rect
            className='playpointer-grab-area'
            fill='none'
            width='10'
            height='30'
            x='-5'
            y='30'
          />
          <rect
            className='playpointer-line'
            fill='#ed5565'
            width='2'
            height='30'
            x='-1'
            y='30'
          />
          <rect
            className='playpointer-time'
            fill='#f2f2f2'
            width='56'
            opacity='0.5'
            height='18'
            transform='translate(-30,65)'
          />
          <circle r='4' cy='60' fill='#ed5565' />
          <text textAnchor='middle' dy='78' fontSize='12'>
            {readableTSPlaying}
          </text>
        </g>
      </g>
    ),
    [playPointerPosition, readableTSPlaying],
  )

  const renderHoverLine = useMemo(
    () => (
      <rect
        className='hoverline'
        height='25'
        transform='translate(0)'
        fill={`${isHoveringOnTimeline ? '#1ab394' : 'transparent'}`}
        width='1'
        x={`${hoverIndicatorX}`}
        y='0'
      />
    ),
    [isHoveringOnTimeline, hoverIndicatorX],
  )

  const renderEdges = useMemo(
    () => (
      <>
        <rect
          className='leftEdge'
          width='10'
          height='80'
          fill='url("#leftEdge")'
          transform={`translate(${leftEdgeEffectX})`}
        />
        <rect
          className='rightEdge'
          width='10'
          height='80'
          fill='url("#rightEdge")'
          transform={`translate(${rightEdgeEffectX})`}
        />
      </>
    ),
    [leftEdgeEffectX, rightEdgeEffectX],
  )

  const renderClickableTimeline = useMemo(
    () => (
      <rect
        id='clickable timeline'
        className={`interactible ${loadingArchivalVideo ? 'waiting' : null}`}
        ref={timelineContainer}
        onMouseMove={onTimelineHover}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        transform='translate(0)'
        x='0'
        y='0'
        fill='transparent'
        width={`${timelineWidth}`}
        height='25'
      />
    ),
    [
      loadingArchivalVideo,
      timelineContainer,
      onTimelineHover,
      onMouseLeave,
      onMouseDown,
      timelineWidth,
    ],
  )

  const renderTimelineCover = useMemo(() => {
    return (
      <rect
        rx='5'
        transform='translate(0)'
        x='0'
        y='0'
        fill='#e5e5e5'
        width={`${timelineWidth}`}
        height='25'
      />
    )
  }, [timelineWidth])

  const renderTimeLine = useMemo(() => {
    return (
      <div id='progress-container' className='progress-container'>
        <svg
          ref={svgContainerRef}
          width='988'
          height='60'
          className='svg-container-v1'
        >
          {renderGradient}
          <g
            transform={`matrix(1, 0, 0, 1, ${viewWindowPosition}, 0)`}
            width='758'
          >
            {renderTimelineCover}
            {renderXAxisMarkers}
            {renderTimelineMarkers}
            {renderPlayPointerGroup}
            {renderHoverLine}
            {renderClickableTimeline}
            {renderClipControl}
            {renderEdges}
          </g>
        </svg>
      </div>
    )
  }, [
    viewWindowPosition,
    renderGradient,
    renderTimelineCover,
    renderXAxisMarkers,
    renderTimelineMarkers,
    renderPlayPointerGroup,
    renderHoverLine,
    renderClickableTimeline,
    renderClipControl,
    renderEdges,
  ])

  return (
    <Tooltip
      placement='top'
      content={displayTooltipContent}
      interactive
      visible={displayTooltip}
    >
      {renderTimeLine}
    </Tooltip>
  )
}

Timeline.propTypes = propTypes

export default Timeline
