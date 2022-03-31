import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
// src
import Tooltip from 'components/Tooltip'

import GifContent from './GifContent'
import useStyles from './styles'

const propTypes = {
  activity: PropTypes.object.isRequired,
  fontSizeClass: PropTypes.string,
  enableOnHover: PropTypes.bool,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  fontSizeClass: 'am-subtitle2',
  enableOnHover: false,
  darkMode: false,
}

function AccessAlarmActivityDescription({
  activity,
  fontSizeClass,
  enableOnHover,
  darkMode,
}) {
  const classes = useStyles({ darkMode })

  const streamName = get(activity, 'reader.stream.name', '')
  const deviceId = get(activity, 'reader.deviceId', '')

  const accessAlarmType = get(
    activity,
    'accessAlarmTypeCast.accessAlarmType',
    'Other',
  )
  // NOTE: Specific case for `Other` type: https://ambient-ai.atlassian.net/browse/AMB-1529
  const name =
    accessAlarmType === 'Other' ? get(activity, 'name') : accessAlarmType

  const description = (
    <Grid container className={clsx(fontSizeClass, classes.grayColor)}>
      <span>
        <span className={clsx(fontSizeClass, classes.redColor)}>{name}</span>
        {streamName && (
          <>
            {' at '}
            <span className={fontSizeClass}>{streamName}</span>
          </>
        )}
        {deviceId && (
          <>
            {' on Device '}
            <span className={fontSizeClass}>{deviceId}</span>
          </>
        )}
      </span>
    </Grid>
  )

  if (activity.evidenceAvailable && activity.clip && enableOnHover) {
    return (
      <Tooltip
        theme='ambient-dark'
        content={<GifContent url={activity.clip} />}
        offset={0}
        distance={-120}
      >
        {description}
      </Tooltip>
    )
  }
  return description
}

AccessAlarmActivityDescription.propTypes = propTypes
AccessAlarmActivityDescription.defaultProps = defaultProps

export default AccessAlarmActivityDescription
