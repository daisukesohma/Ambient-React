import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
// src
import SimpleLabel from 'components/Label/SimpleLabel'

import useStyles from './styles'

export default function NodeField({ nodeName }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {nodeName}
      <span>
        <SimpleLabel>Node</SimpleLabel>
      </span>
    </div>
  )
}

NodeField.defaultProps = {
  nodeName: '',
}

NodeField.propTypes = {
  nodeName: PropTypes.string,
}
