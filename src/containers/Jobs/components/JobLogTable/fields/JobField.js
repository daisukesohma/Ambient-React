import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
// src
import { NodeRequestTypeToReadableEnum } from 'enums'

import useStyles from './styles'

export default function JobField({ requestType }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {NodeRequestTypeToReadableEnum[requestType]}
    </div>
  )
}

JobField.defaultProps = {
  requestType: '',
}

JobField.propTypes = {
  requestType: PropTypes.string,
}
