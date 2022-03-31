import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'

import { getXDomain } from '../components/VideoStreamControlsV2/utils'

const useStoreTimelineRange = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const storeTimelineRange = useCallback(
    (newTime, newTimelineDuration) => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            timeRange: getXDomain(
              false,
              null,
              null,
              newTime,
              newTimelineDuration,
            ),
          },
        }),
      )
    },
    [dispatch, videoStreamKey],
  )

  return storeTimelineRange
}

export default useStoreTimelineRange
