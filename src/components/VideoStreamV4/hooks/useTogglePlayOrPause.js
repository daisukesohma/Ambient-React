import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'

import { setVideoStreamValues } from '../../../redux/slices/videoStreamControls'
import { SLIDER_TO_MINUTES } from '../components/VideoStreamControlsV2/constants'

const useTogglePlayOrPause = ({ videoStreamKey }) => {
  const dispatch = useDispatch()

  return useCallback(
    (_, newValue) => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            timeDomainSliderValue: newValue,
            timelineDuration: moment.duration(
              SLIDER_TO_MINUTES[newValue].mins,
              'minutes',
            ),
          },
        }),
      )
    },
    [dispatch, videoStreamKey],
  )
}

export default useTogglePlayOrPause
