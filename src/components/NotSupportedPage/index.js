import React from 'react'
import { useSelector } from 'react-redux'
import Logo from 'assets/logo_icon.png'

import useStyles from './styles'

const NotSupportedPage = () => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={classes.container}>
      <img alt='logo' className={classes.logo} src={Logo} />
      <br />
      This page is not supported
      <br />
      on this device.
    </div>
  )
}

export default NotSupportedPage
