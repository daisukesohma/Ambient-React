import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

import useStyles from './styles'

export default function StatusField({ status }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return <div className={clsx('am-subtitle2', classes.baseText)}>{status}</div>
}

StatusField.defaultProps = {
  status: '',
}

StatusField.propTypes = {
  status: PropTypes.string,
}
