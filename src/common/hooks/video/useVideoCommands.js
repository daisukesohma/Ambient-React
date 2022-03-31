import { useCallback } from 'react'
import { useUpdateArchivalStreamTs, useChannelMessage } from 'webrtc/hooks'
import {
  WebRTCChannelMessageTypeEnum,
  StreamStateEnum,
  StreamTypeUpdatedEnum,
} from 'enums'
import {
  updateStreamStatus,
  setVideoStreamFeedValues,
} from 'redux/slices/webrtc'
import { useSelector, useDispatch } from 'react-redux'
// src
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'

const useVideoCommands = ({ videoStreamKey }) => {
  const updateArchivalStreamTs = useUpdateArchivalStreamTs()
  const dispatch = useDispatch()
  // const streamState = useSelector(
  //   getStreamFeedData({ videoStreamKey, property: 'status' }),
  // )
  const streamV2Type = useSelector(state => state.settings.streamV2Type)

  const streamMode = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )

  const nodeId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'nodeId' }),
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

  // DATA CHANNEL (DEVICE) MESSAGES START -----------------
  //
  const { sendChannelMessage } = useChannelMessage({
    nodeId,
    videoStreamKey,
    streamId,
    oldTrackId,
  })

  const devicePause = useCallback(() => {
    dispatch(
      updateStreamStatus({
        videoStreamKey,
        status: StreamStateEnum.STOPPED,
      }),
    )
    sendChannelMessage(WebRTCChannelMessageTypeEnum.PAUSE)
  }, [dispatch, videoStreamKey, sendChannelMessage])

  const deviceUnpause = useCallback(() => {
    dispatch(
      updateStreamStatus({
        videoStreamKey,
        status: StreamStateEnum.PLAYING,
      }),
    )
    sendChannelMessage(WebRTCChannelMessageTypeEnum.UNPAUSE)
  }, [dispatch, videoStreamKey, sendChannelMessage])

  const deviceNextFrame = useCallback(() => {
    sendChannelMessage(WebRTCChannelMessageTypeEnum.NEXT_FRAME)
  }, [sendChannelMessage])

  const devicePreviousFrame = useCallback(() => {
    sendChannelMessage(WebRTCChannelMessageTypeEnum.PREVIOUS_FRAME)
  }, [sendChannelMessage])

  const deviceChangeSpeed = useCallback(
    (speed = 1.0) => {
      sendChannelMessage(WebRTCChannelMessageTypeEnum.SPEED, speed)
    },
    [sendChannelMessage],
  )

  //
  // DATA CHANNEL MESSAGES END -----------------

  // requestedTs is in seconds, (not ms)
  const deviceGetVideoAtTime = useCallback(
    requestedTs => {
      if (streamMode !== StreamTypeUpdatedEnum.RECORDED) {
        // Hangup/Request come from the useEffect in VideoStreamFeed component
        dispatch(
          setVideoStreamFeedValues({
            videoStreamKey,
            props: {
              mode: StreamTypeUpdatedEnum.RECORDED,
              requestTs: requestedTs * 1000,
              ts: requestedTs * 1000,
            },
          }),
        )
      } else {
        updateArchivalStreamTs({
          nodeId,
          videoStreamKey,
          streamId,
          oldTrackId,
          ts: requestedTs * 1000,
        })
      }
    },
    [
      nodeId,
      oldTrackId,
      streamId,
      streamMode,
      dispatch,
      updateArchivalStreamTs,
      videoStreamKey,
    ],
  )

  const deviceGoLive = useCallback(() => {
    // Toggle between incident time fragment and live video
    // Value of the component's initTs determines the destination ts
    if (streamMode === StreamTypeUpdatedEnum.RECORDED) {
      dispatch(
        setVideoStreamFeedValues({
          videoStreamKey,
          props: {
            mode: streamV2Type,
          },
        }),
      )
    } else {
      dispatch(
        setVideoStreamFeedValues({
          videoStreamKey,
          props: {
            mode: StreamTypeUpdatedEnum.RECORDED,
          },
        }),
      )
    }
  }, [dispatch, streamV2Type, streamMode, videoStreamKey])

  const stopStream = useCallback(() => {
    dispatch(
      updateStreamStatus({ videoStreamKey, status: StreamStateEnum.STOPPED }),
    )
  }, [dispatch, videoStreamKey])

  const playStream = useCallback(
    videoStreamTS => {
      updateArchivalStreamTs({
        nodeId,
        videoStreamKey,
        streamId,
        oldTrackId,
        ts: videoStreamTS * 1000,
      })
      dispatch(
        updateStreamStatus({ videoStreamKey, status: StreamStateEnum.PLAYING }),
      )
    },
    [
      dispatch,
      nodeId,
      oldTrackId,
      streamId,
      updateArchivalStreamTs,
      videoStreamKey,
    ],
  )

  return {
    deviceGetVideoAtTime,
    deviceGoLive,
    stopStream,
    playStream,
    devicePause,
    deviceUnpause,
    deviceNextFrame,
    devicePreviousFrame,
    deviceChangeSpeed,
    sendChannelMessage,
  }
}

export default useVideoCommands
