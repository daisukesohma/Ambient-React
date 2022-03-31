import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
// src

import useStyles from './styles'

export default function ModeField({ mode }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return <div className={clsx('am-subtitle2', classes.baseText)}>{mode}</div>
}

ModeField.defaultProps = {
  mode: '',
}

ModeField.propTypes = {
  mode: PropTypes.string,
}
