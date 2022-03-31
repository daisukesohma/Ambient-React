import React, { useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Icon } from 'react-icons-kit'
import { history } from 'react-icons-kit/fa/history'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import { setVideoStreamFeedValues } from 'redux/slices/webrtc'
import { useUpdateArchivalStreamTs } from 'webrtc/hooks'
import { StreamTypeUpdatedEnum } from 'enums'

import dataFromTS from '../../utils/dataFromTS'
import withinNonMotionRetentionDuration from '../../utils/withinNonMotionRetentionDuration'
import tsAtMidnight from '../../utils/tsAtMidnight'
import getStreamFeedData from '../../../../selectors/webrtc/getStreamFeedData'
import { msToUnix, unixToMs } from '../../../../utils'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const SeekControl = ({ videoStreamKey }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const updateArchivalStreamTs = useUpdateArchivalStreamTs()

  const showSeekInputDisplay = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showSeekInputDisplay',
    }),
  )
  const streamMode = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )
  const displayEntitySelector = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'displayEntitySelector',
    }),
  )
  const seekInput = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'seekInput' }),
  )
  const subtractDays = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'subtractDays' }),
  )
  const catalogue = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'catalogue' }),
  )
  const isZoomIn = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'isZoomIn',
    }),
  )
  const nodeId = useSelector(
    getStreamFeedData({
      videoStreamKey,
      property: 'nodeId',
    }),
  )

  const streamId = useSelector(
    getStreamFeedData({
      videoStreamKey,
      property: 'streamId',
    }),
  )

  const oldTrackId = useSelector(
    getStreamFeedData({
      videoStreamKey,
      property: 'oldTrackId',
    }),
  )

  const toggleSeekInputDisplay = () => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          showSeekInputDisplay: !showSeekInputDisplay,
        },
      }),
    )
  }

  const retention = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'retention' }),
  )

  const handleSeekClick = useCallback(
    val => {
      const timeTuple = seekInput && seekInput.split(':')
      if (timeTuple && timeTuple.length === 3) {
        const hour = Number(timeTuple[0])
        const min = Number(timeTuple[1])
        const sec = Number(timeTuple[2])

        // Get midnight of today - days to subtract + hour and min to get desired TS
        const currDate = new Date()
        const month = currDate.getMonth()
        const date = currDate.getDate()
        const year = currDate.getFullYear()
        const seekDate = new Date(year, month, date, hour, min, sec, 0)
        const unixTs = msToUnix(seekDate.getTime()) - subtractDays * 3600 * 24
        if (catalogue) {
          // Get cursorPt location from time
          const currentCatalogue = dataFromTS(catalogue, unixTs)
          if (
            currentCatalogue.el ||
            withinNonMotionRetentionDuration(
              unixTs,
              retention.nonmotionSegmentRetentionDays,
            )
          ) {
            dispatch(
              setVideoStreamValues({
                videoStreamKey,
                props: {
                  videoStreamTS: unixTs,
                  playPointerPosition:
                    isZoomIn === 1
                      ? unixTs - tsAtMidnight()
                      : (unixTs - tsAtMidnight()) / 60,
                  currentCatalogPlaying: currentCatalogue,
                },
              }),
            )

            if (streamMode !== StreamTypeUpdatedEnum.RECORDED) {
              // Hangup/Request come from the useEffect in VideoStreamFeed component
              dispatch(
                setVideoStreamFeedValues({
                  videoStreamKey,
                  props: {
                    mode: StreamTypeUpdatedEnum.RECORDED,
                    requestTs: unixToMs(unixTs),
                    ts: unixToMs(unixTs),
                  },
                }),
              )
            } else {
              updateArchivalStreamTs({
                nodeId,
                videoStreamKey,
                streamId,
                oldTrackId,
                ts: unixToMs(unixTs),
              })
            }
          } else {
            this.props.sendTooltipMessage('No Recorded Data at Inputted Time.')
          }
        } else {
          this.props.sendTooltipMessage('No Recorded Data at Inputted Time.')
        }
      } else {
        this.props.sendTooltipMessage('Please enter time in format hh:mm:ss.')
      }
    },
    [
      dispatch,
      catalogue,
      seekInput,
      subtractDays,
      videoStreamKey,
      isZoomIn,
      nodeId,
      retention.nonmotionSegmentRetentionDays,
      streamId,
      streamMode,
      updateArchivalStreamTs,
      oldTrackId,
    ],
  )

  const onSeekChange = useCallback(
    e => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            seekInput:
              e.target.value.length < 8
                ? `${e.target.value}:00`
                : e.target.value,
          },
        }),
      )
    },
    [dispatch, videoStreamKey],
  )

  const seekInputBottom = displayEntitySelector ? '194px' : '155px'

  return (
    <div className='live-button'>
      {showSeekInputDisplay && (
        <div className='seek-input' style={{ bottom: seekInputBottom }}>
          <input
            className='form-control'
            type='time'
            step='1'
            onChange={onSeekChange}
          />
          <button className='btn btn-primary' onClick={handleSeekClick}>
            Seek
          </button>
        </div>
      )}
      <button
        id='live'
        style={{ display: 'flex' }}
        className='playback-button playback-live-indicator'
        type='button'
        onClick={toggleSeekInputDisplay}
      >
        <span style={{ color: palette.grey[600], paddingRight: 5 }}>
          <Icon icon={history} />
        </span>
        <span className={clsx('am-caption', 'buttonText')}>
          {showSeekInputDisplay ? 'Hide' : 'Seek'}
        </span>
      </button>
    </div>
  )
}

SeekControl.propTypes = propTypes

export default SeekControl
