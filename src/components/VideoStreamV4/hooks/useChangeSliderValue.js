import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import get from 'lodash/get'

import { setVideoStreamValues } from '../../../redux/slices/videoStreamControls'
import { SLIDER_TO_MINUTES } from '../components/VideoStreamControlsV2/constants'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'

const useChangeSliderValue = ({ videoStreamKey }) => {
  const dispatch = useDispatch()

  return useCallback(
    (_, newValue) => {
      trackEventToMixpanel(MixPanelEventEnum.VMS_TIME_RANGE_CHANGED)
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            timeDomainSliderValue: newValue,
            timelineDuration: moment.duration(
              get(SLIDER_TO_MINUTES, `[${newValue}].mins`, 30),
              'minutes',
            ),
          },
        }),
      )
    },
    [dispatch, videoStreamKey],
  )
}

export default useChangeSliderValue
