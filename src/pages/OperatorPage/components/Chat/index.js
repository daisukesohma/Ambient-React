import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Icons } from 'ambient_ui'
import TextField from '@material-ui/core/TextField'
import Badge from '@material-ui/core/Badge'
import clsx from 'clsx'

import { fetchUsersRequested } from '../../../../redux/slices/operatorPage'
import UserAvatar from '../../../../components/UserAvatar'

import useStyles from './styles'

export default function Chat() {
  const { palette } = useTheme()
  const [opened, setOpenStatus] = useState(false)
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode, opened })

  const { account } = useParams()
  const dispatch = useDispatch()

  const usersFromStore = useSelector(state => state.operatorPage.users)

  const [users, setUsers] = useState(usersFromStore)

  useEffect(() => {
    dispatch(fetchUsersRequested({ accountSlug: account }))
  }, [dispatch, account])

  const availableUsers = users
    ? users.filter(user => user.profile.isSignedIn)
    : []
  const offlineUsers = users
    ? users.filter(user => !user.profile.isSignedIn)
    : []

  const searchUser = e => {
    let { value } = e.target
    value = value.replace(/ /g, '')
    if (!value) {
      setUsers(usersFromStore)
    } else {
      setUsers(
        users.filter(user =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      )
    }
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        className={classes.header}
        onClick={() => setOpenStatus(!opened)}
      >
        <Grid item sm={11} xs={11} md={11} lg={11} xl={11}>
          Available users ({availableUsers.length})
        </Grid>

        <Grid item sm={1} xs={1} md={1} lg={1} xl={1}>
          {opened ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </Grid>
      </Grid>

      {opened && (
        <Grid className={classes.body}>
          <Grid container direction='column' className={classes.bodyContent}>
            <Grid item className={classes.userGroupHeader}>
              Available
            </Grid>

            {availableUsers.length ? (
              availableUsers.map((user, index) => (
                <Grid
                  key={index}
                  container
                  direction='row'
                  alignItems='center'
                  className={clsx(classes.userItem, classes.userItemActive)}
                >
                  <Grid className={classes.avatarBlock}>
                    <UserAvatar
                      name={user.firstName}
                      img={user.profile.img}
                      size={30}
                    />
                  </Grid>
                  <Grid className={classes.nameBlock}>
                    {`${user.firstName} ${user.lastName}`}
                  </Grid>
                  <Grid className={classes.userStatusBlock}>
                    <Badge color='primary' variant='dot'>
                      {}
                    </Badge>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Grid container justify='center' className={classes.noUsers}>
                No Users
              </Grid>
            )}

            <Grid item className={classes.userGroupHeader}>
              Offline
            </Grid>

            {offlineUsers.length ? (
              offlineUsers.map((user, index) => (
                <Grid
                  key={index}
                  container
                  direction='row'
                  alignItems='center'
                  className={clsx(classes.userItem, classes.userItemActive)}
                >
                  <Grid className={classes.avatarBlock}>
                    <UserAvatar
                      name={user.firstName}
                      img={user.profile.img}
                      size={30}
                    />
                  </Grid>
                  <Grid
                    className={clsx(
                      classes.nameBlock,
                      classes.nameBlockOffline,
                    )}
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </Grid>
                  <Grid className={classes.userStatusBlock}>
                    <Badge
                      color='secondary'
                      variant='dot'
                      classes={{ badge: classes.offlineDot }}
                    >
                      {}
                    </Badge>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Grid container justify='center' className={classes.noUsers}>
                No Users
              </Grid>
            )}
          </Grid>

          <Grid item className={classes.footer}>
            <TextField
              variant='standard'
              fullWidth
              InputProps={{
                className: classes.searchInput,
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icons.Investigate
                      width={24}
                      height={24}
                      stroke={palette.grey[500]}
                    />
                  </InputAdornment>
                ),
              }}
              name='search'
              placeholder='Search'
              onChange={searchUser}
            />
          </Grid>
        </Grid>
      )}
    </div>
  )
}
