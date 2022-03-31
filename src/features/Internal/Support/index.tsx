import React from 'react'
import { useSelector } from 'react-redux'
// src
import { Box, Grid } from '@material-ui/core'
import { Button } from 'ambient_ui'
import { Can } from 'rbac'

import { useStyles } from './styles'

export default function Support(): JSX.Element {
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  // eslint-disable-next-line
  const classes = useStyles({ darkMode })
  return (
    <Grid
      container
      spacing={4}
      className={classes.root}
      alignItems='flex-start'
      direction='row'
      justify='space-evenly'
    >
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <div className='am-h4'>Support Access</div>
          </Box>
          <Box>
            <Can I='request' on='SupportAccess'>
              <Button
                color='primary'
                variant='contained'
                customStyle={{ marginLeft: 8 }}
              >
                Request Access
              </Button>
            </Can>
          </Box>
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} />
    </Grid>
  )
}
