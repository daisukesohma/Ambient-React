import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import get from 'lodash/get'

import useStyles from './styles'

const propTypes = {
  activity: PropTypes.object.isRequired,
  fontSizeClass: PropTypes.string,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  fontSizeClass: 'am-subtitle1',
  darkMode: false,
}

function WorkShiftActivityDescription({ activity, fontSizeClass, darkMode }) {
  const classes = useStyles({ darkMode })
  return (
    <div className={clsx(fontSizeClass, classes.grayColor)}>
      <span className={fontSizeClass}>
        {`${get(activity, 'profile.user.firstName')} ${get(
          activity,
          'profile.user.lastName',
        )} `}
      </span>
      <span className={clsx(fontSizeClass, classes.blueColor)}>
        {get(activity, 'signIn') ? 'signed in' : 'signed out'}
      </span>
    </div>
  )
}

WorkShiftActivityDescription.propTypes = propTypes
WorkShiftActivityDescription.defaultProps = defaultProps

export default WorkShiftActivityDescription
