import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
// src
import SimpleLabel from 'components/Label/SimpleLabel'

import useStyles from './styles'

export default function RegionField({ regionName }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {regionName}
      <span>
        <SimpleLabel>Region</SimpleLabel>
      </span>
    </div>
  )
}

RegionField.defaultProps = {
  regionName: '',
}

RegionField.propTypes = {
  regionName: PropTypes.string,
}
