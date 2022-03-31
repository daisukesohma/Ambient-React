import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useStyles from './styles'

RouterLink.defaultProps = {
  to: '',
  children: null,
}

RouterLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
}

export default function RouterLink({ to, children }) {
  const classes = useStyles()
  return (
    <Link to={to} className={classes.link}>
      {children}
    </Link>
  )
}
