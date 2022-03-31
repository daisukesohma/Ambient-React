/* eslint-disable import/no-cycle */
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { setVideoStreamValues } from '../../../redux/slices/videoStreamControls'
import { useVideoCommands } from '../../../common/hooks/video'
import { getXDomain } from '../components/VideoStreamControlsV2/utils'
import getVideoStreamControlsState from '../../../selectors/videoStreamControls/getVideoStreamControlsState'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'

const useGotoPlaybackTime = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const WRITING_BUFFER = 0.15
  const { deviceGetVideoAtTime } = useVideoCommands({ videoStreamKey })
  const timelineDuration = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timelineDuration',
    }),
  )

  return (startDate, newSpeed = 1) => {
    // Every 30s we write a catalogue, with a bit extra to allow for writing.
    const availableRecordedStart = moment().subtract(
      0.5 + WRITING_BUFFER,
      'minutes',
    )
    const isAvailable = moment(startDate).isBefore(availableRecordedStart)
    if (!isAvailable) {
      trackEventToMixpanel(MixPanelEventEnum.VMS_STREAM_FALLBACK_TO_LIVE)
    }
    const gotoTime = isAvailable ? startDate : availableRecordedStart

    // Sync Video Stream Feed
    // processing date
    const momentTime = moment(gotoTime)
    const momentUnix = momentTime.unix()
    deviceGetVideoAtTime(momentUnix) // webrtc command for feed
    // Sync Timeline
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          key: new Date().getTime(),
          startAt: gotoTime,
          speed: newSpeed,
          playTime: moment(momentTime).toDate(),
          times: [],
          timeRange: getXDomain(false, null, null, gotoTime, timelineDuration),
        },
      }),
    )
  }
}

export default useGotoPlaybackTime
