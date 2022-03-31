import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import { showModal } from 'redux/slices/modal'
import { ModalTypeEnum } from 'enums'

import useStyles from './styles'

function VideoWallCellHover({ selectedStream, fullscreen, closeFullscreen }) {
  const theme = useTheme()
  const classes = useStyles()
  const darkMode = useSelector(state => state.settings.darkMode)
  const dispatch = useDispatch()
  const onExpandFeed = () => {
    // close any modals that might be open
    // show the feed modal
    const {
      streamName,
      streamId,
      nodeId,
      nodeToken,
      siteName,
      siteSlug,
      timezone,
    } = selectedStream
    dispatch(
      showModal({
        content: {
          streamName,
          streamId,
          nodeId,
          nodeToken,
          siteName,
          siteSlug,
          timezone,
        },
        type: ModalTypeEnum.VIDEO,
      }),
    )
    if (fullscreen) {
      closeFullscreen()
    }
  }

  return (
    <Grid container className={classes.hoverContainer}>
      <Grid container item alignItems='center' alignContent='center'>
        {selectedStream.label}
      </Grid>

      <span
        onClick={onExpandFeed}
        className={clsx('feed-popup p-xs', classes.expandIcon)}
      >
        <Icons.Maximize
          style={{
            color: darkMode
              ? theme.palette.common.white
              : theme.palette.grey[800],
          }}
          width={24}
          height={24}
          stroke={
            darkMode ? theme.palette.common.white : theme.palette.grey[100]
          }
        />
      </span>
    </Grid>
  )
}

VideoWallCellHover.defaultProps = {
  selectedStream: {},
  fullscreen: false,
  closeFullscreen: () => {},
}

VideoWallCellHover.propTypes = {
  selectedStream: PropTypes.shape({
    label: PropTypes.string,
    streamName: PropTypes.string,
    streamId: PropTypes.number,
    nodeId: PropTypes.string,
    nodeToken: PropTypes.string,
    siteName: PropTypes.string,
    siteSlug: PropTypes.string,
    timezone: PropTypes.string,
  }),
  fullscreen: PropTypes.bool,
  closeFullscreen: PropTypes.func,
}

export default VideoWallCellHover
