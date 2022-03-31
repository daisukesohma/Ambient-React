import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'

import useStyles from './styles'

export default function AvatarName({ darkMode, url, name, description }) {
  const classes = useStyles({ darkMode })

  return (
    <Box className={classes.root} ml={2}>
      <Avatar src={url} className={classes.avatar} />
      <Grid container direction='column'>
        <div className={clsx('am-subtitle1', classes.name)}>{name}</div>
        <div className={clsx('am-caption', classes.description)}>
          {description}
        </div>
      </Grid>
    </Box>
  )
}
