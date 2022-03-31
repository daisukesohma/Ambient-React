import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import get from 'lodash/get'
import Grid from '@material-ui/core/Grid'

import useStyles from './styles'

const propTypes = {
  activity: PropTypes.object.isRequired,
  fontSizeClass: PropTypes.string,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  fontSizeClass: 'am-subtitle2',
  darkMode: false,
}

function ProfileOverrideLogActivityDescription({
  activity,
  fontSizeClass,
  darkMode,
}) {
  const classes = useStyles({ darkMode })
  return (
    <Grid className={clsx(fontSizeClass, classes.grayColor)}>
      <span>Security profile updated from </span>
      <span className={clsx(fontSizeClass, classes.blackColor)}>
        {get(activity, 'overriddenSecurityProfile.name', 'Disabled')}
      </span>
      <span> to </span>
      <span className={clsx(fontSizeClass, classes.blueColor)}>
        {get(activity, 'overridingSecurityProfile.name', 'Disabled')}
      </span>
      <span> on </span>
      <span className={clsx(fontSizeClass, classes.blueColor)}>
        {get(activity, 'overridingSecurityProfile.site.name', 'Site')}
      </span>
      <span> by </span>
      <span
        className={clsx(fontSizeClass, classes.blackColor)}
        style={{ marginRight: 8 }}
      >
        {`${activity.user.firstName} ${activity.user.lastName}`}
      </span>
    </Grid>
  )
}

ProfileOverrideLogActivityDescription.propTypes = propTypes
ProfileOverrideLogActivityDescription.defaultProps = defaultProps

export default ProfileOverrideLogActivityDescription
