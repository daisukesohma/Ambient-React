import React from 'react'
import { Box, Grid, Typography, Button } from '@material-ui/core'

// src
import WebLogo from 'assets/web_logo_white_bg.png'
import useStyles from './style'


export default function ErrorContent() {
  const classes = useStyles()

  const onReload = () => window.location.reload()
  const onRoot = () => {
    window.location.href = '/'
  }

  return (
    <Grid item>
      <Box display='flex' justifyContent='center' mb={8}>
        <img
          src={WebLogo}
          alt='Ambient'
        />
      </Box>

      <Typography
        variant='h3'
        className={classes.text}
      >
        Something went wrong
      </Typography>

      <Box mt={12}>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Box mr={1} variant='h5' fontSize={14} className={classes.text}>
            Please, try to
          </Box>
          <Button
            variant='clear'
            onClick={onReload}
            classes={{
              label: classes.primaryText,
              root: classes.buttonRoot,
            }}
          >
            Reload
          </Button>
          <Box
            mr={1}
            ml={1}
            variant='h5'
            fontSize={14}
            className={classes.text}
          >
            or
          </Box>
          <Button
            variant='clear'
            onClick={onRoot}
            classes={{
              label: classes.primaryText,
              root: classes.buttonRoot,
            }}
          >
            Home Page
          </Button>
        </Grid>
      </Box>
    </Grid>
  )
}
