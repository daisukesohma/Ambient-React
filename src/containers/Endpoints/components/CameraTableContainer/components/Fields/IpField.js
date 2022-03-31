import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
// src
import SimpleLabel from 'components/Label/SimpleLabel'

import useStyles from './styles'

export default function IpField({ hostname }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {hostname}
      <span>
        <SimpleLabel>IP</SimpleLabel>
      </span>
    </div>
  )
}

IpField.defaultProps = {
  hostname: '',
}

IpField.propTypes = {
  hostname: PropTypes.string,
}
