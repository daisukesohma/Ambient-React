import React from 'react'
import PropTypes from 'prop-types'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

import useStyles from './styles-mui'

const propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  toggleSidebar: PropTypes.func,
}

function ExpandableSidebar({ children, isOpen }) {
  const classes = useStyles()

  return (
    <SwipeableDrawer
      classes={{
        paper: classes.root,
      }}
      anchor='right'
      open={isOpen}
    >
      {children}
    </SwipeableDrawer>
  )
}

ExpandableSidebar.propTypes = propTypes

export default ExpandableSidebar
