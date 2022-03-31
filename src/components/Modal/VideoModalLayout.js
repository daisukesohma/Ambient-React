import React from 'react'
import { connect, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'
import clsx from 'clsx'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import VideoStreamComponent from 'components/VideoStreamComponent'

import { MixPanelEventEnum, StreamTypeEnum } from '../../enums'
import useMixpanel from '../../mixpanel/hooks/useMixpanel'

const { Sites } = Icons

const MIN_HEIGHT = 450
const MIN_WIDTH = '100%'

const useStyles = makeStyles(theme => ({
  title: {
    margin: 0,
    marginLeft: 8,
    color: ({ isDarkMode }) =>
      isDarkMode ? theme.palette.common.white : theme.palette.common.black,
  },
  subTitle: {
    color: ({ isDarkMode }) => theme.palette.grey[isDarkMode ? 400 : 700],
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: 12,
    marginTop: 8,
  },
  videoContainer: {
    margin: 'auto',
  },
}))

function VideoModalLayout({
  isDarkMode,
  streamName,
  accountSlug,
  siteSlug,
  siteName,
  streamId,
  nodeIdentifier,
  streamType,
  initTs,
  tsTimelineHighlight,
  isZoomInInit,
  timezone,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ isDarkMode })

  const useNewVideoPlayer = useSelector(
    state => state.settings.useNewVideoPlayer,
  )

  useMixpanel(MixPanelEventEnum.VMS_OPENED, { siteName })

  // TODO: check this place with `playerVersion` usage
  // const videoContainerClass = playerVersion === 2 ? undefined : classes.videoContainer
  const videoContainerClass = useNewVideoPlayer
    ? undefined
    : classes.videoContainer

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div>
          <span className={clsx('am-h5', classes.title)} id='alert-modal-title'>
            {streamName}
          </span>
          {siteName && (
            <div className={clsx('am-subtitle2', classes.subTitle)}>
              <span style={{ marginRight: 4 }}>
                <Sites
                  stroke={isDarkMode ? palette.grey[300] : palette.grey[700]}
                  height={18}
                  width={18}
                />
              </span>
              {siteName}
            </div>
          )}
        </div>
      </div>
      <Grid container className={videoContainerClass}>
        <Grid item xs={12} sm={12} lg={12} md={12} xl={12}>
          <VideoStreamComponent
            accountSlug={accountSlug}
            initTS={initTs}
            initTs={initTs}
            isZoomInInit={isZoomInInit}
            key={`${accountSlug}-${siteSlug}-${nodeIdentifier}-${streamId}`}
            minHeight={MIN_HEIGHT}
            minWidth={MIN_WIDTH}
            nodeId={nodeIdentifier}
            showPlaybackControls
            siteSlug={siteSlug}
            videoStreamKey='modal'
            streamId={streamId}
            streamType={streamType}
            tsTimelineHighlight={tsTimelineHighlight}
            viewMode='JPG'
            willAutoLoad
            timezone={timezone}
          />
        </Grid>
      </Grid>
    </>
  )
}

VideoModalLayout.defaultProps = {
  accountSlug: null,
  initTs: null,
  isDarkMode: false,
  isZoomInInit: 0,
  nodeIdentifier: null,
  siteName: null,
  siteSlug: null,
  streamId: null,
  streamName: '',
  streamType: StreamTypeEnum.NORMAL,
  tsTimelineHighlight: null,
  timezone: DEFAULT_TIMEZONE,
}

VideoModalLayout.propTypes = {
  accountSlug: PropTypes.string,
  initTs: PropTypes.number,
  isDarkMode: PropTypes.bool,
  isZoomInInit: PropTypes.number,
  nodeIdentifier: PropTypes.string,
  siteName: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  streamName: PropTypes.string,
  streamType: PropTypes.string,
  tsTimelineHighlight: PropTypes.number,
  timezone: PropTypes.string,
}

const mapStateToProps = state => ({
  streamType: state.settings.streamType,
})

export default connect(
  mapStateToProps,
  null,
)(VideoModalLayout)
