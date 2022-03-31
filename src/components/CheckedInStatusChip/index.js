import React from 'react'
import Chip from '@material-ui/core/Chip'
import PropTypes from 'prop-types'

import useStyles from './styles'

const defaultProps = {
  isSignedIn: false,
  contactResource: null,
}

const propTypes = {
  isSignedIn: PropTypes.bool,
  contactResource: PropTypes.object,
}

const CheckInStatusChip = ({ isSignedIn, contactResource }) => {
  const classes = useStyles()

  // const isEmail = contactResource.contactResourceType === 'EMAIL'

  if (!isSignedIn) {
    return (
      <Chip
        label='Checked Out'
        classes={{ label: classes.label, root: classes.root }}
      />
    )
  }

  return (
    <Chip
      label={`Checked In${contactResource ? `: ${contactResource.name}` : ''}`}
      classes={{ label: classes.activeLabel, root: classes.activeRoot }}
    />
  )
}

CheckInStatusChip.propTypes = propTypes
CheckInStatusChip.defaultProps = defaultProps

export default CheckInStatusChip
