import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import moment from 'moment'

import useStyles from './styles'

export default function DateCreatedField({ dateCreated }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      {moment.unix(dateCreated).format('YYYY-MM-DD')}
    </div>
  )
}

DateCreatedField.defaultProps = {
  dateCreated: '',
}

DateCreatedField.propTypes = {
  dateCreated: PropTypes.string,
}
