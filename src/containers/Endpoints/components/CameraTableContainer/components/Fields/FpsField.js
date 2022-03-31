import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

import useStyles from './styles'

const defaultProps = {
  fps: '',
}

const propTypes = {
  fps: PropTypes.number,
}

export default function FpsField({ fps }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {fps && fps >= 0 ? fps.toFixed(2) : '-'}
    </div>
  )
}

FpsField.defaultProps = defaultProps
FpsField.propTypes = propTypes
