import React from 'react'
import Grid from '@material-ui/core/Grid'
import { CircularProgress } from 'ambient_ui'
import clsx from 'clsx'
// src
import Logo from 'assets/logo_icon.png'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

export default function LoadingScreen(): JSX.Element {
  const classes = useStyles()
  const flexClasses = useFlexStyles()

  return (
    <Grid container className={classes.container}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        className={classes.logoutRootBlock}
      >
        <img src={Logo} alt='Ambient' className={classes.logo} />
        <div
          className={clsx(
            classes.loading,
            flexClasses.row,
            flexClasses.centerAll,
          )}
        >
          <span className='am-h6'>Loading...</span>
          <span className={classes.progress}>
            <CircularProgress />
          </span>
        </div>
      </Grid>
    </Grid>
  )
}
