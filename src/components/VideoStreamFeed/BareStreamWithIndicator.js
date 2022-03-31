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
        videoStreamKey={string} --> Identifies the video element
        initTS={startTS} --> Sets an initTS to start stream at [unixTS in secs]
      />,
*/

import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Icons } from 'ambient_ui'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'

import { WebRTCMessageTypeEnum, StreamStateEnum } from '../../enums'
import { sendP2PMessageRequested } from '../../redux/slices/webrtc'
import mediaStreams from '../../webrtc/mediaStreams'

import './index.css'

const { Play } = Icons

const propTypes = {
  videoStreamKey: PropTypes.string,
  streamPlaceholder: PropTypes.string,
  streamId: PropTypes.number,
  nodeId: PropTypes.string,
}

const defaultProps = {
  videoStreamKey: null,
  streamPlaceholder: null,
  streamId: null,
  nodeId: null,
}

const VideoStream = ({
  videoStreamKey,
  streamPlaceholder,
  streamId,
  nodeId,
}) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false)
  const streams = useSelector(state => state.webrtc.streams)

  const streamData = streams ? streams[videoStreamKey] : null
  const streamState = streamData ? streamData.status : null

  const videoElem = useRef(null)

  const hangupStream = useCallback(() => {
    if (videoElem && (videoElem.current.src || videoElem.current.srcObject)) {
      dispatch(
        sendP2PMessageRequested({
          videoStreamKey,
          nodeId,
          data: {
            type: WebRTCMessageTypeEnum.HANG_UP,
            trackid: videoElem.current.srcObject.id,
          },
        }),
      )

      //      videoElem.current.srcObject = null
    }
  }, [])

  const playElem = evt => {
    if (videoElem && (videoElem.current.src || videoElem.current.srcObject)) {
      videoElem.current
        .play()
        .then(() => {
          // Check for frame
        })
        .catch(err => {
          console.error(`Error playing stream: ${err}`)
        })
    }
  }

  const updateWithNewStream = useCallback(() => {
    hangupStream()

    dispatch(
      sendP2PMessageRequested({
        nodeId,
        videoStreamKey,
        data: {
          type: WebRTCMessageTypeEnum.REQUEST_STREAM,
          streamid: 12, // streamId,
          mode: '0',
          trackid: videoStreamKey,
        },
      }),
    )
  }, [streamId])

  useEffect(() => {
    if (streamId) {
      updateWithNewStream()
    }

    return function cleanup() {
      hangupStream()
    }
  }, [streamId, updateWithNewStream, hangupStream])

  useEffect(() => {
    if (
      streamData &&
      streamData.status === StreamStateEnum.READY &&
      mediaStreams.streams[videoStreamKey] &&
      mediaStreams.streams[videoStreamKey].mediaStream
    ) {
      videoElem.current.srcObject =
        mediaStreams.streams[videoStreamKey].mediaStream
      playElem()
    }
  }, [streamData, videoStreamKey])

  // three parts, preview element, video element, loading element
  // loading element is displayed first, then when preview is found, the preview element is showed
  // pressing the play button displays the video element
  let previewDisplay
  let streamDisplay
  let loadingDisplay
  let waitingDisplay
  if (streamState === StreamStateEnum.LOADING) {
    loadingDisplay = 'flex'
    previewDisplay = 'none'
    streamDisplay = 'none'
    waitingDisplay = 'none'
  } else if (
    streamState === StreamStateEnum.READY ||
    StreamStateEnum.LIVE ||
    streamState === StreamStateEnum.ARCHIVAL
  ) {
    loadingDisplay = 'none'
    previewDisplay = 'none'
    streamDisplay = 'inline-block'
    waitingDisplay = 'none'
  } else if (streamState === StreamStateEnum.MAX_CLIENTS) {
    loadingDisplay = 'none'
    previewDisplay = 'none'
    streamDisplay = 'none'
    waitingDisplay = 'inline-block'
  } else {
    loadingDisplay = 'none'
    previewDisplay = 'inline-block'
    streamDisplay = 'none'
    waitingDisplay = 'none'
  }

  if (
    videoElem.current &&
    !videoElem.current.srcObject &&
    mediaStreams.streams[videoStreamKey]
  ) {
    videoElem.current.srcObject =
      mediaStreams.streams[videoStreamKey].mediaStream
  }

  const indicatorStatus = streamState
    ? streamState.charAt(0) + streamState.slice(1).toLowerCase()
    : null

  // This is necessary for live streaming to work on mobile browsers.

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <div
          className='play-btn-container'
          style={{
            display: `${previewDisplay}`,
            color: 'red',
            cursor: 'pointer',
          }}
          onClick={playElem}
        >
          <span
            style={{
              display: `${previewDisplay}`,
              marginLeft: 4,
              marginTop: 3,
              cursor: 'pointer',
            }}
            onClick={playElem}
          >
            <Play
              stroke={palette.common.white}
              fill={palette.common.white}
              onClick={playElem}
              style={{
                cursor: 'pointer',
              }}
            />
          </span>
        </div>
        <img
          className='preview full live-stream-placeholder'
          alt='Stream Preview'
          src={streamPlaceholder}
          style={{
            display: placeholderLoaded ? `${previewDisplay}` : 'none',
            width: '100%',
            backgroundColor: 'black',
          }}
          onClick={playElem}
          onLoad={() => setPlaceholderLoaded(true)}
        />
      </div>
      <Grid container style={{ display: `${loadingDisplay}` }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <LinearProgress />
        </Grid>
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
              src={streamPlaceholder}
              style={{
                display: placeholderLoaded ? 'inline-block' : 'none',
                width: '100%',
                backgroundColor: 'black',
              }}
              onClick={playElem}
              onLoad={() => setPlaceholderLoaded(true)}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container style={{ display: `${waitingDisplay}` }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            bgcolor='text.primary'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <span style={{ color: palette.common.white }}>
              Max viewers reached
            </span>
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
          height: 'auto',
        }}
      >
        <div
          style={{
            display: `${streamDisplay}`,
            position: 'relative',
            width: '100%',
            height: 'auto',
          }}
        >
          <span
            className='indicator'
            style={{
              display: `${streamDisplay}`,
              position: 'absolute',
              background: palette.secondary.main,
              color: palette.common.white,
              right: 0,
              padding: '4px',
              margin: '4px',
              fontSize: '12px',
            }}
          >
            {indicatorStatus}
          </span>
          <div
            style={{
              width: '100%',
              height: 'auto',
              overflow: 'initial',
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
              }}
              ref={videoElem}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

VideoStream.defaultProps = defaultProps

VideoStream.propTypes = propTypes

export default VideoStream
