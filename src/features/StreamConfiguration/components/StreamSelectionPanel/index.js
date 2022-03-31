import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
// src
import Tooltip from 'components/Tooltip'
import Toolbox from 'features/StreamConfiguration/components/StreamConfigurationToolbar/components/Toolbox'
import SiteSelector from 'features/StreamConfiguration/components/SiteSelector'
import StreamSelectionModal from 'features/StreamConfiguration/components/StreamSelectionPanel/components/StreamSelectionModal'
import { setIsStreamSelectionModalOpen } from 'features/StreamConfiguration/streamConfigurationSlice'
import useStyles from './styles'

export default function StreamSelectionPanel() {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const isStreamSelectionModalOpen = useSelector(
    state => state.streamConfiguration.isStreamSelectionModalOpen,
  )
  const activeStreamName = useSelector(state =>
    get(state.streamConfiguration.activeStream, 'name', 'Select stream'),
  )

  return (
    <>
      <Grid
        container
        justify='flex-start'
        alignItems='center'
        display='flex'
        flexDirection='row'
      >
        <SiteSelector />
        <Tooltip 
          content='Select Stream'
          placement='bottom'
        >
          <Box
            onClick={() => dispatch(setIsStreamSelectionModalOpen(true))}
            ml={2}
            mr={3}
            display='flex'
            alignItems='center'
            className={classes.selectStream}
          >
            {activeStreamName}
          </Box>
        </Tooltip>
        <Toolbox />
        <StreamSelectionModal
          open={isStreamSelectionModalOpen}
          handleClose={() => dispatch(setIsStreamSelectionModalOpen(false))}
        />
      </Grid>
    </>
  )
}
