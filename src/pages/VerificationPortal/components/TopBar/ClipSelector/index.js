import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'

// src
import { toggleClipsType } from '../../../redux/verificationSlice'
import useStyles from './styles'

function ClipSelector() {
  const classes = useStyles()
  const clipSpe = useSelector(state => state.verification.clipSpe)
  const dispatch = useDispatch()

  return (
    <Box>
      <span className={'am-overline'}>
        {`SPE ${clipSpe ? 'Enabled' : 'Disabled'}`}
      </span>
      <Switch
        classes={{ track: classes.track }}
        color='primary'
        checked={clipSpe}
        onChange={() => dispatch(toggleClipsType())}
      />
    </Box>
  )
}

export default ClipSelector
