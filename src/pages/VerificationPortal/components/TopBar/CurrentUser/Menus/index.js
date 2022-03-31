import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import get from 'lodash/get'

import useStyles from './styles'
import ConfirmDialog from 'components/ConfirmDialog'

function Menus() {
  const history = useHistory()
  const classes = useStyles()
  const darkMode = useSelector(state => state.settings.darkMode)

  const accounts = useSelector(state => state.auth.accounts)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  const goToInternalDashboard = () => history.push('/internal')
  const goToEditProfile = () =>
    history.push(`/accounts/${get(accounts, '[0].slug', '')}/settings/profile`)
  const logout = () => setLogoutConfirmOpen(true)

  return (
    <div className={classes.root}>
      <div className={classes.item} onClick={goToInternalDashboard}>
        Internal Dashboard
      </div>
      <div className={classes.item} onClick={goToEditProfile}>
        Edit Profile
      </div>
      <div className={classes.item} onClick={logout}>
        Log out
      </div>
      {/* <div className={classes.item}>Help</div> */}
      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => {
          setLogoutConfirmOpen(false)
        }}
        onConfirm={() => {
          setLogoutConfirmOpen(true)
          history.push('/logout')
        }}
        content='Are you sure you want to logout?'
      />
    </div>
  )
}

export default Menus
