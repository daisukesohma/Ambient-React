import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CachedIcon from '@material-ui/icons/Cached'

// src
import Tooltip from 'components/Tooltip'
import useStyles from './styles'

function RefreshSelector() {
  const classes = useStyles()

  return (
    <Box onClick={() => window.location.reload()}>
      <Tooltip
        content={
          <div className={classes.tooltipText}>
            <Typography className='am-subtitle1'>
              Refresh Verification Portal
            </Typography>
          </div>
        }
        placement='bottom'
        theme='ambient-white'
        arrow
      >
        <div className={classes.icon}>
          <CachedIcon />
        </div>
      </Tooltip>
    </Box>
  )
}

export default RefreshSelector
