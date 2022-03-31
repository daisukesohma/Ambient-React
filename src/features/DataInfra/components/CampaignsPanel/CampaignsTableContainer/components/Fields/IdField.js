import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import useStyles from './styles'

export default function IdField({ campaignId }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>{campaignId}</div>
  )
}

IdField.defaultProps = {
  campaignId: null,
}

IdField.propTypes = {
  campaignId: PropTypes.number,
}
