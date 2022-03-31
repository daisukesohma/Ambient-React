import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import FlipNumbers from 'react-flip-numbers'
// src
import { Icon } from 'ambient_ui'
import { useFuturisticStyles, useFlexStyles } from 'common/styles/commonStyles'

import { SLIDER_TO_MINUTES } from '../../../../../constants'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import useStyles from './styles'

TimeDomainDisplay.propTypes = {
  videoStreamKey: PropTypes.string,
}

export default function TimeDomainDisplay({ videoStreamKey }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const futuristicClasses = useFuturisticStyles()

  const timeDomainSliderValue = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeDomainSliderValue',
    }),
  )

  return (
    <div className={clsx(flexClasses.row)}>
      <span style={{ marginLeft: 8 }}>
        <Icon icon='search' color={palette.primary[500]} size={16} />
      </span>
      <span
        className={clsx(
          futuristicClasses.iceSheet,
          classes.speed,
          'am-overline',
          flexClasses.row,
          flexClasses.centerAll,
        )}
      >
        <FlipNumbers
          height={12}
          width={12}
          color={palette.primary[500]}
          background='transparent'
          play
          perspective={100}
          numbers={`${get(
            SLIDER_TO_MINUTES[timeDomainSliderValue],
            'unitValue',
          )}`}
        />
        <div className='am-overline' style={{ color: palette.primary }}>
          {get(SLIDER_TO_MINUTES[timeDomainSliderValue], 'unit')}
        </div>
      </span>
    </div>
  )
}
