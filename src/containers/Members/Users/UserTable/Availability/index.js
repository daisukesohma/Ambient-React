import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

const Availability = ({ availability }) => {
  const classes = useStyles({ availability })

  return (
    <div className={classes.root}>
      {availability !== 'N/A' && <div className={classes.marker} />}
      <div>{availability}</div>
    </div>
  )
}

Availability.defaultProps = {
  availability: [],
}

Availability.propTypes = {
  availability: PropTypes.string,
}

export default Availability
