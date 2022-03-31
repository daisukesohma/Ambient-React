/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { Icon } from 'ambient_ui'

export default function AlertRequested(): JSX.Element {
  return (
    <Box mr={2} display='flex' flexDirection='row' alignItems='center'>
      <Box mr={1} display='flex'>
        {/* @ts-ignore */}
        <Icon icon='dispatch' size={24} />
      </Box>
      <Typography className='am-subtitle2' variant='body1' color='textPrimary'>
        Requested for &nbsp;
      </Typography>
      <Typography className='am-subtitle2' variant='body1' color='primary'>
        Vikesh
      </Typography>
    </Box>
  )
}
