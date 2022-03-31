import React from 'react'
import { Grid } from '@material-ui/core'

import CurrentUser from './CurrentUser'
import Logo from './Logo'
import Title from './Title'
import useStyles from './styles'

function TopBar() {
  const classes = useStyles()

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.leftContainer}>
        <Logo containerStyle={{ marginRight: 16 }} width={35} />
        <Title title='Data Infra Portal' />
      </Grid>
      <Grid className={classes.rightContainer}>
        <CurrentUser />
      </Grid>
    </Grid>
  )
}

export default TopBar
