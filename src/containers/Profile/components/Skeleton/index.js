import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import Grid from '@material-ui/core/Grid'
import { isMobile } from 'react-device-detect'

import PageTitle from 'components/Page/Title'

import useStyles from './styles'

export default function ProfileSkeleton() {
  const classes = useStyles()

  const renderAvatar = () => (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      <Grid container className={classes.container}>
        <Grid item lg={12} md={12} sm={12} xs={12} className={classes.flexItem}>
          <Grid>
            <Skeleton variant='circle' className={classes.avatar} />
          </Grid>
          <Grid className={classes.avatarInfo}>
            <Skeleton variant='rect' className={classes.textField} />
            <Skeleton variant='rect' className={classes.textField} />
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.container}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Skeleton variant='rect' className={classes.textField} />
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <PageTitle title='Profile Settings' />
        </Grid>
      </Grid>
      {isMobile && renderAvatar()}
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Grid container className={classes.container}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Skeleton variant='rect' className={classes.textField} />
          </Grid>
        </Grid>
      </Grid>
      {!isMobile && renderAvatar()}
    </Grid>
  )
}
