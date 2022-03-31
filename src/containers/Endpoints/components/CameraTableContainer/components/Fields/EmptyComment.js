import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import useStyles from './styles'

const propTypes = {
  siteName: PropTypes.string,
  isLoading: PropTypes.bool,
}

const defaultProps = {
  siteName: null,
  isLoading: false,
}

const EmptyComment = ({ siteName, isLoading }) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  let message
  if (isLoading) {
    message = 'Loading'
  } else if (siteName) {
    message = `No available cameras on ${siteName}`
  } else {
    message = 'No available cameras'
  }

  return <span className={clsx('am-body2', classes.baseText)}>{message}</span>
}

EmptyComment.propTypes = propTypes
EmptyComment.defaultProps = defaultProps

export default EmptyComment
