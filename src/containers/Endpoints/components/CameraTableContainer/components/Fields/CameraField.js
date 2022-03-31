import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import useStyles from './styles'

export default function CameraField({ streamName }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>{streamName}</div>
  )
}

CameraField.defaultProps = {
  streamName: '',
}

CameraField.propTypes = {
  streamName: PropTypes.string,
}
