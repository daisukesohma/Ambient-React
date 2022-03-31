import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import {
  DEFAULT_SLIDER_VALUE,
  SLIDER_MARKS,
  SLIDER_MAX,
  SLIDER_MIN,
} from '../../../../../constants'
import IOSSlider from '../IOSSlider'
import getVideoStreamControlsState from '../../../../../../../../../selectors/videoStreamControls/getVideoStreamControlsState'
import useChangeSliderValue from '../../../../../../../hooks/useChangeSliderValue'

const propTypes = {
  videoStreamKey: PropTypes.string,
}

const TimeDomainSlider = ({ videoStreamKey }) => {
  const timeDomainSliderValue = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeDomainSliderValue',
    }),
  )

  const onChange = useChangeSliderValue({ videoStreamKey })

  return (
    <IOSSlider
      value={timeDomainSliderValue}
      aria-label='ios slider'
      onChange={onChange}
      defaultValue={DEFAULT_SLIDER_VALUE}
      min={SLIDER_MIN}
      max={SLIDER_MAX}
      marks={SLIDER_MARKS}
      valueLabelDisplay='on'
    />
  )
}

TimeDomainSlider.propTypes = propTypes

export default memo(TimeDomainSlider)
