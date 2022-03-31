/* eslint-disable no-prototype-builtins, no-console */
/*
   This is the react component which enables Live Streaming
   It can be imported into another react application or called as a method (see index.js)
   author: rodaan@ambient.ai

   How to Use:

      <VideoStream
        streamId={streamId}
        nodeId={nodeId}
        streamType={streamType} --> Sets if you want SPE or regular stream ['JPG' or 'SPE'] --> Use the StreamTypeEnum
        willAutoLoad={willAutoLoad} --> Will start the video play on load [true or false]
        videoStreamKey={string} --> Identifies the video element
        initTs={startTS} --> Sets an initTs to start stream at [unixTS in secs]
      />,
*/
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
// src
import { Icons } from 'ambient_ui'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import getIndicatorStatus from 'selectors/webrtc/getIndicatorStatus'
import IndicatorStatusBadge from 'components/IndicatorStatusBadge'
import { StreamStateEnum, StreamTypeUpdatedEnum, ModalTypeEnum } from 'enums'
import {
  initVideoStreamFeed,
  fetchStreamSnapshotRequested,
  updateStreamStatus,
  removeVideoStreamFeed,
} from 'redux/slices/webrtc'
import mediaStreams from 'webrtc/mediaStreams'
import { useRequestStream, useHangUpStream } from 'webrtc/hooks'
import { tsAtMidnight, unixToMs } from 'utils'
import { createNotification } from 'redux/slices/notifications'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'
import ErrorLabel from './components/ErrorLabel'
import ImagePlaceholder from './components/ImagePlaceholder'
import useStyles from './styles'

const { Play } = Icons

const propTypes = {
  accountSlug: PropTypes.string,
  isOnVideoWall: PropTypes.bool,
  isOnAlertModal: PropTypes.bool,
  willAutoLoad: PropTypes.bool,
  videoStreamKey: PropTypes.string,
  streamId: PropTypes.number,
  nodeId: PropTypes.string,
  showIndicator: PropTypes.bool,
  showPlaybackControls: PropTypes.bool,
  initTs: PropTypes.number,
  alertEvent: PropTypes.object,
  videoStyles: PropTypes.object, // v4
  videoRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]), // v4
  isMobile: PropTypes.bool,
}

const defaultProps = {
  initTs: null,
  isOnAlertModal: false,
  isOnVideoWall: false,
  nodeId: null,
  showIndicator: true,
  showPlaybackControls: false,
  streamId: null,
  videoRef: null,
  videoStreamKey: null,
  videoStyles: {},
  willAutoLoad: true,
  isMobile: false,
}

const VideoStreamFeed = ({
  accountSlug,
  initTs,
  isOnAlertModal,
  isOnVideoWall,
  alertEvent,
  nodeId,
  showIndicator,
  showPlaybackControls,
  streamId,
  videoRef, // v4
  videoStreamKey,
  videoStyles, // v4
  willAutoLoad,
  isMobile,
}) => {
  const { palette } = useTheme()
  const localVideoRef = useRef(null)
  const videoElem = videoRef || localVideoRef
  const modalType = useSelector(state => state.modal.type)
  const modalData = useSelector(state => state.modal.data)
  const classes = useStyles({
    isOnVideoWall,
    isOnAlertModal,
  })
  const dispatch = useDispatch()
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false)

  const streamV2Type = useSelector(state => state.settings.streamV2Type)
  const requestedAt = useRef(0)

  // try to take `retentionMotionDays` from alertEvent.stream.note object for VMS window with AlertEvent. Because initially we haven't `retention` object from catalogue
  const retentionMotionDays = useMemo(() => {
    if (modalType === ModalTypeEnum.VIDEO) {
      return get(modalData, 'retentionMotionDays', 0)
    }
    if (alertEvent) {
      return get(alertEvent, 'stream.node.retentionMotionDays', 0)
    }
    return get(modalData, 'alertEvent.stream.node.retentionMotionDays', 0)
  }, [alertEvent, modalType, modalData])

  const motionSegmentRetentionDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'retention.motionSegmentRetentionDays',
      defaultValue: retentionMotionDays,
    }),
  )

  // try to take `retentionNonmotionDays` from alertEvent.stream.note object for VMS window with AlertEvent. Because initially we haven't `retention` object from catalogue
  const retentionNonmotionDays = useMemo(() => {
    if (modalType === ModalTypeEnum.VIDEO) {
      return get(modalData, 'retentionNonmotionDays', 0)
    }
    if (alertEvent) {
      return get(alertEvent, 'stream.node.retentionNonmotionDays', 0)
    }
    return get(modalData, 'alertEvent.stream.node.retentionNonmotionDays', 0)
  }, [alertEvent, modalType, modalData])

  const nonmotionSegmentRetentionDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'retention.nonmotionSegmentRetentionDays',
      defaultValue: retentionNonmotionDays,
    }),
  )

  const maxRetentionDays = useMemo(
    () =>
      Math.max(
        0,
        motionSegmentRetentionDays,
        nonmotionSegmentRetentionDays,
        retentionNonmotionDays,
        retentionMotionDays,
      ),
    [motionSegmentRetentionDays, nonmotionSegmentRetentionDays],
  )

  const requestStream = useRequestStream()
  const hangUpStream = useHangUpStream()

  const p2pId = useSelector(state => state.webrtc.p2pId)

  // Common way to change state.
  const changeState = useCallback(
    status => {
      dispatch(
        updateStreamStatus({
          videoStreamKey,
          status,
        }),
      )
    },
    [videoStreamKey, dispatch],
  )

  // Initialize redux slice, all other effects depend on values in redux that can be changed.
  const initVideoStreamFeedEffect = useEffect(() => {
    const mode = initTs === null ? streamV2Type : StreamTypeUpdatedEnum.RECORDED
    const requestTs = unixToMs(initTs)
    const ts = requestTs
    const props = {
      streamId,
      nodeId,
      initTs,
      willAutoLoad,
      mode,
      requestTs,
      ts,
    }
    dispatch(
      initVideoStreamFeed({
        videoStreamKey,
        props,
      }),
    )
  }, [
    initTs,
    streamId,
    nodeId,
    willAutoLoad,
    streamV2Type,
    videoStreamKey,
    dispatch,
  ])

  const streamState = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'status' }),
  )

  const reduxRequestTs = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'requestTs' }),
  )

  const reduxMode = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )

  const mode = useMemo(() => {
    if (isNil(reduxMode)) {
      return initTs === null ? streamV2Type : StreamTypeUpdatedEnum.RECORDED
    }
    return reduxMode
  }, [reduxMode, streamV2Type])

  const requestTs = useMemo(() => {
    if (isNil(reduxRequestTs)) {
      if (mode === StreamTypeUpdatedEnum.RECORDED) {
        if (isNil(initTs)) {
          return null
        }
        return unixToMs(initTs)
      }
    }
    return reduxRequestTs
  }, [reduxRequestTs, mode, initTs])

  const snapshot = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'snapshot' }),
  )

  const [cycle, setCycle] = useState(1)

  const indicatorStatus = useSelector(
    getIndicatorStatus({ videoStreamKey, mode }),
  )

  const mediaStream = get(
    mediaStreams.streams[videoStreamKey],
    'mediaStream',
    null,
  )

  const readyState = useMemo(() => streamState === StreamStateEnum.READY, [
    streamState,
  ])
  const playingState = useMemo(() => streamState === StreamStateEnum.PLAYING, [
    streamState,
  ])
  const stoppedState = useMemo(() => streamState === StreamStateEnum.STOPPED, [
    streamState,
  ])

  // TODO: @rodaan Make this state show a banner telling user to hard refresh the page
  //  const errorState = useSelector(state => state.inError)

  const reportLatency = useCallback(() => {
    const streamLatency = Date.now() - requestedAt.current
    const latencyStreamId = get(
      mediaStreams.streams[videoStreamKey],
      'streamId',
      null,
    )
    const latencyMode = get(mediaStreams.streams[videoStreamKey], 'mode', null)
    const latencyNodeId = get(
      mediaStreams.streams[videoStreamKey],
      'nodeId',
      null,
    )
    requestedAt.current = 0
    trackEventToMixpanel(MixPanelEventEnum.VMS_STREAM_PLAYING, {
      latency: streamLatency,
      node_id: latencyNodeId,
      stream_id: latencyStreamId,
      mode: latencyMode,
    })
  }, [videoStreamKey])

  // All states other than READY, PLAYING, and STOPPED end after 10 sec if not already changed.
  const autoRetry = useCallback(() => {
    if (
      streamState &&
      streamState !== StreamStateEnum.PLAYING &&
      streamState !== StreamStateEnum.STOPPED &&
      streamState !== StreamStateEnum.MAX_CLIENTS
    ) {
      trackEventToMixpanel(MixPanelEventEnum.VMS_PEER_CONNECTION_RETRY, {
        node_id: nodeId,
        stream_id: streamId,
        stream_state: streamState,
        mode,
      })
      setCycle(prevCycle => prevCycle + 1)
    }
  }, [videoStreamKey, streamState, nodeId, streamId, mode, setCycle])

  // Promise-based video play/pause, controlled by streamState through an Effect
  const playElem = useCallback(
    evt => {
      if (videoElem.current) {
        videoElem.current
          .play()
          .then(() => {
            if (requestedAt.current > 0) {
              reportLatency()
            }
            changeState(StreamStateEnum.PLAYING)
          })
          .catch(err => {
            if (videoElem.current) {
              console.error(`Error playing stream: ${err}`)
            }
          })
      }
    },
    [changeState, reportLatency],
  )

  const stopElem = useCallback(
    evt => {
      if (videoElem.current) {
        videoElem.current
          .play()
          .then(() => {
            if (videoElem.current) {
              if (requestedAt.current > 0) {
                reportLatency()
              }
              videoElem.current.pause()
              changeState(StreamStateEnum.STOPPED)
            }
          })
          .catch(err => {
            if (videoElem.current) {
              console.error(`Error playing stream: ${err}`)
            }
          })
      }
    },
    [changeState, reportLatency],
  )

  // User action: alternates STOPPED and PLAYING
  const togglePlayPause = useCallback(
    evt => {
      const currState = getStreamFeedData({
        videoStreamKey,
        property: 'status',
      })
      if (currState === StreamStateEnum.PLAYING) {
        stopElem()
      } else if (currState === StreamStateEnum.STOPPED) {
        playElem()
      }
    },
    [videoStreamKey, playElem, stopElem],
  )

  const removeStreamCallback = useCallback(() => {
    dispatch(removeVideoStreamFeed({ videoStreamKey }))
    delete mediaStreams.streams[videoStreamKey]
  }, [videoStreamKey, dispatch])

  // Effect to trigger timeout/recovery from disconnects or other invalid states
  const retryTimeoutEffect = useEffect(() => {
    const retryTimeout = setTimeout(autoRetry, 10000)
    return () => {
      clearTimeout(retryTimeout)
    }
  }, [autoRetry])

  const notifyOutOfRetentionEffect = useEffect(() => {
    const oldestTs = unixToMs(tsAtMidnight(maxRetentionDays * -1))
    if (requestTs && requestTs < oldestTs) {
      dispatch(
        createNotification({
          message: 'Requested footage older than max retention days',
        }),
      )
    }
  }, [requestTs, maxRetentionDays, dispatch])

  // Request stream / hangup cycle, every request goes through the following state, in order:
  // READY -> LOADING -> ASSIGNED -> [PLAYING <=> STOPPED] -> HANGING_UP -> READY
  // Each cycle has a unique uuid() set in the requestStream hook, so old cycles that were still
  // in progress can killed.
  const requestStreamEffect = useEffect(() => {
    dispatch(fetchStreamSnapshotRequested({ videoStreamKey, streamId }))
    const requestStreamObj = {
      nodeId,
      videoStreamKey,
      streamId,
      mode,
    }
    if (mode === StreamTypeUpdatedEnum.RECORDED) {
      requestStreamObj.ts = requestTs
    }
    changeState(StreamStateEnum.READY)
    if (p2pId) {
      requestedAt.current = Date.now()
      requestStream(requestStreamObj)
      trackEventToMixpanel(MixPanelEventEnum.VMS_STREAM_REQUESTED, {
        node_id: nodeId,
        stream_id: streamId,
        mode,
      })
    }
    return () => {
      const newTrackId = get(
        mediaStreams.streams[videoStreamKey],
        'newTrackId',
        null,
      )
      if (videoStreamKey && nodeId && newTrackId) {
        hangUpStream({
          videoStreamKey,
          nodeId,
          newTrackId,
        })
      }
    }
  }, [
    p2pId,
    nodeId,
    videoStreamKey,
    streamId,
    requestStream,
    hangUpStream,
    mode,
    requestTs,
    cycle,
    dispatch,
  ])

  // Assign mediaStream, then change to PLAYING (or STOPPED on mobile),
  // the mediaStream only changes when a stream is added or ended (Events listened for in sagas/webrtc)
  const assignSrcObject = useEffect(() => {
    if (mediaStream !== null && videoElem.current) {
      videoElem.current.srcObject = mediaStream
      if (willAutoLoad) {
        playElem()
      } else {
        stopElem()
      }
    }
    return () => {
      if (videoElem.current) {
        videoElem.current.srcObject = null
      }
    }
  }, [
    mediaStream,
    videoStreamKey,
    willAutoLoad,
    playElem,
    stopElem,
    changeState,
  ])

  const removeStreamEffect = useEffect(() => {
    return removeStreamCallback
  }, [])

  // three parts, preview element, video element, loading element
  // loading element is displayed first, then when preview is found, the preview element is showed
  // pressing the play button displays the video element
  let previewDisplay
  let streamDisplay
  let loadingDisplay
  if (streamState === StreamStateEnum.LOADING) {
    loadingDisplay = 'flex'
    previewDisplay = 'none'
    streamDisplay = 'none'
  } else if (
    streamState === StreamStateEnum.PLAYING ||
    streamState === StreamStateEnum.STOPPED
  ) {
    loadingDisplay = 'none'
    previewDisplay = 'none'
    streamDisplay = 'inline-block'
  } else if (streamState === StreamStateEnum.MAX_CLIENTS) {
    // handled in ErrorLabel
    loadingDisplay = 'none'
    previewDisplay = 'none'
    streamDisplay = 'none'
  } else {
    loadingDisplay = 'none'
    previewDisplay = 'inline-block'
    streamDisplay = 'none'
  }

  // This is necessary for live streaming to work on mobile browsers.

  return (
    <div
      className={classes.videoRoot}
      style={{ minHeight: isOnAlertModal ? 0 : 0 }}
    >
      <ErrorLabel videoStreamKey={videoStreamKey} />
      <ImagePlaceholder
        placeholderLoaded={placeholderLoaded}
        playElem={togglePlayPause}
        previewDisplay={previewDisplay}
        setPlaceholderLoaded={setPlaceholderLoaded}
        snapshot={snapshot}
      />
      <Grid container style={{ display: `${loadingDisplay}` }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            bgcolor='text.primary'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <img
              className='preview full live-stream-placeholder'
              alt='Stream Preview'
              src={snapshot}
              style={{
                display: placeholderLoaded ? 'inline-block' : 'none',
                width: '100%',
                backgroundColor: 'black',
              }}
              onClick={togglePlayPause}
              onLoad={() => setPlaceholderLoaded(false)}
            />
          </Box>
        </Grid>
      </Grid>

      <div
        style={{
          background: 'black',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <div
          style={{
            display: `${streamDisplay}`,
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              // overflow: 'initial', ?? Why we need it?
              // NOTE: added for correct position of video element
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <video
              muted
              playsInline
              className='stream live-stream-placeholder'
              style={{
                width: '100%',
                minHeight: '0',
                opacity: 1,
                height: '100%',
                // NOTE: added for correct position of video element
                position: 'absolute',
                ...videoStyles,
              }}
              ref={videoElem}
              controls={isMobile}
            />
          </div>
          {showIndicator && (
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <IndicatorStatusBadge
                status={
                  isMobile
                    ? videoElem.paused
                      ? 'PAUSED'
                      : 'LIVE'
                    : indicatorStatus
                }
                display={streamDisplay}
                variant='naked'
                pulseRippleColor='white'
              />
            </div>
          )}
          {!isMobile &&
            !showPlaybackControls &&
            streamState === StreamStateEnum.STOPPED && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(50% - 12px)',
                  left: 'calc(50% - 12px)',
                  right: 0,
                }}
                onClick={togglePlayPause}
              >
                <Play
                  stroke={palette.common.white}
                  fill={palette.common.white}
                  onClick={playElem}
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

VideoStreamFeed.defaultProps = defaultProps
VideoStreamFeed.propTypes = propTypes

export default VideoStreamFeed
