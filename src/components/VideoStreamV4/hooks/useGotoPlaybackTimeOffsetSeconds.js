import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
// src
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import { VideoIconControlEffectEnum } from 'enums'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import useGotoPlaybackTime from './useGotoPlaybackTime'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'

const useGotoPlaybackTimeOffsetSeconds = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const playTime = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playTime',
    }),
  )

  const gotoPlaybackTime = useGotoPlaybackTime({ videoStreamKey })

  const dispatchEffectIconName = useCallback(
    (effectIconName, uniqueId) => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            effectIconName,
            effectIconKey: uniqueId, // any unique key
          },
        }),
      )
    },
    [dispatch, videoStreamKey],
  )

  const getIconFromOffset = offset => {
    switch (offset) {
      case 10:
        return VideoIconControlEffectEnum.FORWARD10
      case -10:
        return VideoIconControlEffectEnum.BACK10
      case 5:
        return VideoIconControlEffectEnum.FORWARD5
      case -5:
        return VideoIconControlEffectEnum.BACK5
      default:
        if (Math.abs(offset) >= 1) {
          // if is more than 1 second (not frame fwd/back)
          return offset > 0
            ? VideoIconControlEffectEnum.FORWARD
            : VideoIconControlEffectEnum.BACK
        }
        return null
    }
  }

  const gotoPlaybackTimeOffsetSeconds = offset => {
    const icon = getIconFromOffset(offset)

    if (icon) {
      dispatchEffectIconName(icon, new Date().getTime()) // second param: date is just for a unique key
    }
    trackEventToMixpanel(MixPanelEventEnum.VMS_FRAME_MOVED_10_SECONDS)
    gotoPlaybackTime(
      moment(playTime)
        .add(offset, 'seconds')
        .toDate(),
    )
  }

  return {
    gotoPlaybackTimeOffsetSeconds,
    gotoPlaybackTime,
  }
}

export default useGotoPlaybackTimeOffsetSeconds
