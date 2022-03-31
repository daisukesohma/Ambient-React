import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// src
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import {
  StreamStateEnum,
  StreamTypeUpdatedEnum,
  VideoIconControlEffectEnum,
} from 'enums'
import useGotoPlaybackTimeOffsetSeconds from 'components/VideoStreamV4/hooks/useGotoPlaybackTimeOffsetSeconds' // eslint-disable-line import/no-cycle

import useVideoCommands from './useVideoCommands'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'

const useVideoPlayerCommands = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const {
    gotoPlaybackTimeOffsetSeconds,
    gotoPlaybackTime,
  } = useGotoPlaybackTimeOffsetSeconds({
    videoStreamKey,
  })
  const {
    devicePause,
    deviceUnpause,
    deviceNextFrame,
    devicePreviousFrame,
  } = useVideoCommands({ videoStreamKey })

  const isPlaying =
    useSelector(getStreamFeedData({ videoStreamKey, property: 'status' })) ===
    StreamStateEnum.PLAYING

  const streamType = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )
  const isPlayingLive =
    streamType === StreamTypeUpdatedEnum.NORMAL ||
    streamType === StreamTypeUpdatedEnum.SPE

  const playerPlayPause = () => {
    trackEventToMixpanel(MixPanelEventEnum.VMS_FRAME_PLAY_PAUSE)
    if (isPlaying) playerPauseRecorded()
    else {
      playerUnpauseRecorded()

      // When playing live, the video feed will continue with live time,
      // and this will reset the timeline to live time
      if (isPlayingLive) playerResetToLiveTime()
    }
  }

  const playerResetToLiveTime = useCallback(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          key: new Date().getTime(),
          startAt: new Date(),
          speed: 1,
          playTime: new Date(),
          times: [], // will reset the times array, which keeps track of different times played at different speeds
        },
      }),
    )
  }, [dispatch, videoStreamKey])

  const playerPauseRecorded = () => {
    if (isPlaying) {
      devicePause()
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            effectIconName: VideoIconControlEffectEnum.PAUSE,
            effectIconKey: new Date().getTime(), // any unique key
          },
        }),
      )
    }
  }

  const playerUnpauseRecorded = () => {
    if (!isPlaying) {
      deviceUnpause()
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            effectIconName: VideoIconControlEffectEnum.PLAY,
            effectIconKey: new Date().getTime(), // any unique key
          },
        }),
      )
    }
  }

  const playerNextFrame = () => {
    trackEventToMixpanel(MixPanelEventEnum.VMS_FRAME_NEXT)
    deviceNextFrame()
    gotoPlaybackTimeOffsetSeconds(1 / 6)
  }

  const playerPreviousFrame = () => {
    trackEventToMixpanel(MixPanelEventEnum.VMS_FRAME_PREVIOUS)
    devicePreviousFrame()
    gotoPlaybackTimeOffsetSeconds(-1 / 6)
  }

  // sync playtime when playing to now time
  useEffect(() => {
    if (isPlaying && isPlayingLive) playerResetToLiveTime()
  }, [isPlaying, isPlayingLive, playerResetToLiveTime])

  return {
    playerMoveSeconds: gotoPlaybackTimeOffsetSeconds,
    gotoPlaybackTime,
    playerPlayPause,
    playerPauseRecorded,
    playerUnpauseRecorded,
    playerNextFrame,
    playerPreviousFrame,
    playerResetToLiveTime,
  }
}

export default useVideoPlayerCommands
