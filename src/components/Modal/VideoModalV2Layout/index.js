import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useQuery } from '@apollo/react-hooks'
// src
import { StreamTypeEnum, MixPanelEventEnum } from 'enums'
import VideoStreamComponent from 'components/VideoStreamComponent'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import compact from 'lodash/compact'

import ForensicsSearch from '../../VideoStreamV4/components/VideoStreamControlsV2/components/ForensicsSearch'
import getVideoStreamControlsState from '../../../selectors/videoStreamControls/getVideoStreamControlsState'

import VideoTitle from './components/VideoTitle'
import CloseButton from './components/CloseButton'
import useStyles from './styles'
import useVideoMouseMove from './useVideoMouseMove'
import { GET_STREAM_REGION } from './gql'
import useMixpanel from 'mixpanel/hooks/useMixpanel'

const MIN_HEIGHT = '100%'
const MIN_WIDTH = '100%'

const VideoModalV2Layout = ({
  accountSlug,
  handleClose,
  initTs,
  isZoomInInit,
  nodeIdentifier,
  siteSlug,
  streamId,
  timezone,
  tsTimelineHighlight,
  videoStreamKey,
  siteName,
}) => {
  const { onMove, userActive } = useVideoMouseMove({
    videoStreamKey,
  })

  useMixpanel(MixPanelEventEnum.VMS_OPENED, { siteName })

  const showForensicsPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showForensicsPanel',
    }),
  )

  const { data } = useQuery(GET_STREAM_REGION, { variables: { streamId } })

  const classes = useStyles({ showForensicsPanel, userActive })
  const streamType = useSelector(state =>
    get(state, 'settings.streamType', StreamTypeEnum.NORMAL),
  )
  const streamName = useSelector(state => get(state, 'modal.data.streamName'))
  const regionName = get(data, 'getStream.region.name')

  return (
    <>
      <div
        id='video-modal'
        onMouseMove={onMove}
        onClick={onMove}
        className={classes.modalContainer}
      >
        <div id='video-modal-hover-bg' className={classes.hoverBg} />
        <CloseButton handleClose={handleClose} userActive={userActive} />
        <VideoTitle
          title={streamName}
          subtitle={compact([siteName, regionName]).join(' / ')}
          userActive={userActive}
        />
        <VideoStreamComponent
          accountSlug={accountSlug}
          initTs={initTs}
          initTS={initTs}
          isZoomInInit={isZoomInInit}
          key={`${accountSlug}-${siteSlug}-${nodeIdentifier}-${streamId}`}
          minHeight={MIN_HEIGHT}
          minWidth={MIN_WIDTH}
          nodeId={nodeIdentifier}
          showPlaybackControls
          siteSlug={siteSlug}
          streamId={streamId}
          streamType={streamType}
          timezone={timezone}
          tsTimelineHighlight={tsTimelineHighlight}
          userActive={userActive}
          videoStreamKey={videoStreamKey}
          viewMode='JPG'
          willAutoLoad
        />
      </div>
      <div style={{ gridArea: '1/20/1/26', overflowY: 'auto' }}>
        <ForensicsSearch
          accountSlug={accountSlug}
          videoStreamKey={videoStreamKey}
          timezone={timezone}
          siteSlug={siteSlug}
          streamId={streamId}
        />
      </div>
    </>
  )
}

VideoModalV2Layout.defaultProps = {
  videoStreamKey: 'modal',
  accountSlug: null,
  initTs: null,
  isDarkMode: false,
  isZoomInInit: 0,
  nodeIdentifier: null,
  siteName: null,
  siteSlug: null,
  streamId: null,
  streamName: '',
  tsTimelineHighlight: null,
  timezone: DEFAULT_TIMEZONE,
  handleClose: () => {},
}

VideoModalV2Layout.propTypes = {
  videoStreamKey: PropTypes.string,
  accountSlug: PropTypes.string,
  initTs: PropTypes.number,
  isDarkMode: PropTypes.bool,
  isZoomInInit: PropTypes.number,
  nodeIdentifier: PropTypes.string,
  siteName: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  streamName: PropTypes.string,
  tsTimelineHighlight: PropTypes.number,
  handleClose: PropTypes.func,
  timezone: PropTypes.string,
}

export default VideoModalV2Layout
