import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import { Icons } from '../index'

const useStyles = makeStyles(({ palette }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  marker: {
    width: 4,
    height: 44,
    marginRight: 25,
  },
  icon: {
    paddingTop: 5,
  },
  label: {
    fontSize: 20,
    color: palette.common.black,
    marginLeft: 30,
  },
}))

const Drawer = ({ label, icon, markColor }) => {
  const classes = useStyles()
  const Icon = icon && Icons[icon.charAt(0).toUpperCase() + icon.slice(1)]
  return (
    <div className={classes.container}>
      <div className={classes.marker} style={{ backgroundColor: markColor }} />
      <div className={classes.icon}>{icon && <Icon />}</div>
      <div className={classes.label}>{label}</div>
    </div>
  )
}

Drawer.defaultProps = {
  label: 'Default',
  icon: undefined,
  markColor: '#1881FF',
}

Drawer.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  markColor: PropTypes.string,
}

export default Drawer
