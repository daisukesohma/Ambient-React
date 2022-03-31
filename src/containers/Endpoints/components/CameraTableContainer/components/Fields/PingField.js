import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

import useStyles from './styles'

export default function PingField({ ping }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {ping && ping >= 0 ? ping.toFixed(2) : '-'}
    </div>
  )
}

PingField.defaultProps = {
  ping: '',
}

PingField.propTypes = {
  ping: PropTypes.number,
}
