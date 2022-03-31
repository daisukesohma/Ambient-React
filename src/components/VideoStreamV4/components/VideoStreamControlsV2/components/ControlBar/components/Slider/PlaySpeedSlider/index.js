import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import FlipNumbers from 'react-flip-numbers'
import { useTheme } from '@material-ui/core/styles'
import { useFlexStyles, useFuturisticStyles } from 'common/styles/commonStyles'
import { withOrientationChange } from 'react-device-detect'

import useStyles from './styles'
import {
  DEFAULT_SLIDER_VALUE,
  SLIDER_MARKS,
  SLIDER_MAX,
  SLIDER_MIN,
} from './constants'
import Slider from './Slider'

const propTypes = {
  onChange: PropTypes.func,
  speedLabel: PropTypes.node,
  isPortrait: PropTypes.any, // bool?
}

const PlaySpeedSlider = ({ onChange, speedLabel, isPortrait }) => {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const classes = useStyles()
  const futuristicClasses = useFuturisticStyles()

  return (
    <div
      className={clsx(flexClasses.row, flexClasses.centerStart, classes.root)}
    >
      {!isPortrait && <span>-</span>}
      <div
        className={
          isPortrait ? classes.sliderContainerPortrait : classes.sliderContainer
        }
      >
        <Slider
          aria-label='ios slider'
          onChange={onChange}
          defaultValue={DEFAULT_SLIDER_VALUE}
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          marks={SLIDER_MARKS}
          valueLabelDisplay='off'
        />
      </div>
      {!isPortrait && <span>+</span>}
      <span
        style={{ marginLeft: 8, padding: 4 }}
        className={clsx(futuristicClasses.iceSheet, classes.speed)}
      >
        <FlipNumbers
          height={14}
          width={14}
          color={palette.primary[500]}
          background='transparent'
          play
          perspective={100}
          numbers={speedLabel}
        />
      </span>
    </div>
  )
}

PlaySpeedSlider.propTypes = propTypes

export default memo(withOrientationChange(PlaySpeedSlider))
