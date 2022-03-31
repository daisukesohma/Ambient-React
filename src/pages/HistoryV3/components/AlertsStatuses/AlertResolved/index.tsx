import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { Done as DoneIcon } from '@material-ui/icons'

export default function AlertResolved(): JSX.Element {
  return (
    <Box mr={2} display='flex' flexDirection='row' alignItems='center'>
      <Box mr={1} display='flex'>
        <DoneIcon htmlColor='#00CCA0' fontSize='small' />
      </Box>
      <Typography className='am-subtitle2' variant='body1' color='textPrimary'>
        Resolved
      </Typography>
    </Box>
  )
}
