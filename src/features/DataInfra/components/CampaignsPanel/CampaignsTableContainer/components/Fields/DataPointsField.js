import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import useStyles from './styles'

export default function DataPointsField({ numDataPoints }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {numDataPoints}
    </div>
  )
}

DataPointsField.defaultProps = {
  numDataPoints: '',
}

DataPointsField.propTypes = {
  numDataPoints: PropTypes.string,
}
