import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import Tooltip from 'components/Tooltip'

import GifContent from './GifContent'
import useStyles from './styles'

const propTypes = {
  activity: PropTypes.object.isRequired,
  fontSizeClass: PropTypes.string,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  fontSizeClass: 'am-subtitle2',
  darkMode: false,
}

function AlertEventActivityDescription({ activity, fontSizeClass, darkMode }) {
  const classes = useStyles({ darkMode })

  const deviceId = get(activity, 'accessReader.deviceId')
  const streamName = get(activity, 'stream.name')
  const streamSite = get(activity, 'stream.site.name')

  const renderDeviceId = (
    <>
      on Device{' '}
      <span className={clsx(fontSizeClass, classes.blackColor)}>
        {deviceId}{' '}
      </span>
    </>
  )

  const renderStreamName = (
    <>
      at{' '}
      <span className={clsx(fontSizeClass, classes.blackColor)}>
        {streamName}{' '}
      </span>
    </>
  )

  const renderStreamSite = (
    <>
      in{' '}
      <span className={clsx(fontSizeClass, classes.blackColor)}>
        {streamSite}{' '}
      </span>
    </>
  )

  const description = (
    <div className={clsx(fontSizeClass, classes.grayColor, classes.root)}>
      <span className={clsx(fontSizeClass, classes.redColor)}>
        {get(activity, 'alert.name', 'Alert')}{' '}
      </span>
      <span>
        {streamName && renderStreamName}
        {streamSite && renderStreamSite}
        {deviceId && renderDeviceId}
      </span>
    </div>
  )

  if (activity.clip) {
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

AlertEventActivityDescription.propTypes = propTypes
AlertEventActivityDescription.defaultProps = defaultProps

export default AlertEventActivityDescription
