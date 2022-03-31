import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { isMobile } from 'react-device-detect'
// src
import Apollo from 'providers/apollo'
import { StreamTypeEnum } from 'enums'
import {
  resetState,
  fetchDispatchStatusSucceeded,
} from 'redux/slices/alertModal'
import { GET_DISPATCH_STATUS } from 'sagas/alertModal/gql'
import VideoStreamComponent from 'components/VideoStreamComponent'

import AlertPanel from '../../../VideoStreamV4/components/VideoStreamControlsV2/components/AlertPanel'
import CloseButton from '../../VideoModalV2Layout/components/CloseButton'
import ForensicsSearch from '../../../VideoStreamV4/components/VideoStreamControlsV2/components/ForensicsSearch'
import getVideoStreamControlsState from '../../../../selectors/videoStreamControls/getVideoStreamControlsState'
import useVideoMouseMove from '../../VideoModalV2Layout/useVideoMouseMove'
import VideoTitle from '../../VideoModalV2Layout/components/VideoTitle'

import useStyles from './styles'

const propTypes = {
  accountSlug: PropTypes.string,
  videoStreamKey: PropTypes.string,
  handleClose: PropTypes.func,
  isHigh: PropTypes.bool,
  alertEventId: PropTypes.number,
  alertEventHash: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  nodeId: PropTypes.number,
  timezone: PropTypes.string,
  initTs: PropTypes.number,
  siteName: PropTypes.string,
  streamName: PropTypes.string,
  hideAlertTimeline: PropTypes.bool,
  hideAlertModalControls: PropTypes.bool,
  hideResponderList: PropTypes.bool,
  canRecall: PropTypes.bool,
  deviceId: PropTypes.string,
}

const defaultProps = {
  handleClose: () => {},
  videoStreamKey: 'modal',
  isHigh: false,
  hideAlertTimeline: false,
  hideAlertModalControls: false,
  hideResponderList: false,
  canRecall: false,
  deviceId: null,
}

const AlertModalWithSidebar = ({
  accountSlug,
  videoStreamKey,
  handleClose,
  isHigh,
  alertEventId,
  alertEventHash,
  siteSlug,
  streamId,
  nodeId,
  timezone,
  initTs,
  siteName,
  streamName,
  coordinates,
  alertName,
  alertInstances,
  hideAlertTimeline,
  hideAlertModalControls,
  hideResponderList,
  canRecall,
  deviceId,
}) => {
  const dispatch = useDispatch()

  const { onMove, userActive } = useVideoMouseMove({ videoStreamKey })

  const showAlertPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showAlertPanel',
    }),
  )

  const showForensicsPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showForensicsPanel',
    }),
  )

  const classes = useStyles({
    withSideBar: showAlertPanel || showForensicsPanel,
    userActive,
  })

  const fetchDispatchStatus = useCallback(() => {
    Apollo.client
      .query({
        query: GET_DISPATCH_STATUS,
        variables: {
          alertEventId,
          alertEventHash,
        },
      })
      .then(response => {
        dispatch(fetchDispatchStatusSucceeded(response.data))
      })
      .catch(error => {
        throw error
      })
  }, [alertEventId, alertEventHash, dispatch])

  useEffect(() => {
    if (hideAlertTimeline) return () => {}

    fetchDispatchStatus()
    const intervalId = setInterval(fetchDispatchStatus, 5000)
    return () => {
      dispatch(resetState())
      clearInterval(intervalId)
    }
  }, [fetchDispatchStatus, dispatch])

  const subtitle = deviceId ? `${deviceId} in ${siteName}` : siteName

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
          subtitle={subtitle}
          userActive={userActive}
        />
        <VideoStreamComponent
          accountSlug={accountSlug}
          siteSlug={siteSlug}
          streamId={Number(streamId)}
          nodeId={nodeId}
          viewMode={StreamTypeEnum.NORMAL}
          videoStreamKey={videoStreamKey}
          willAutoLoad={!isMobile}
          key={alertEventId}
          showPlaybackControls
          initTS={initTs}
          initTs={initTs}
          minStreamHeight='400px' // not used on Revamped Video Stream
          isOnAlertModal
          timezone={timezone}
          alertInstances={alertInstances}
        />
      </div>

      <div
        id='alert-panel-root'
        style={{
          gridArea: '1/20/1/26',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {showAlertPanel && (
          <AlertPanel
            accountSlug={accountSlug}
            videoStreamKey={videoStreamKey}
            timezone={timezone}
            isHigh={isHigh}
            alertEventId={alertEventId}
            alertEventHash={alertEventHash}
            siteSlug={siteSlug}
            siteName={siteName}
            streamName={streamName}
            initTs={initTs}
            coordinates={coordinates}
            alertName={alertName}
            alertInstances={alertInstances}
            hideAlertTimeline={hideAlertTimeline}
            hideAlertModalControls={hideAlertModalControls}
            hideResponderList={hideResponderList}
            canRecall={canRecall}
            deviceId={deviceId}
          />
        )}
        {showForensicsPanel && (
          <ForensicsSearch
            accountSlug={accountSlug}
            videoStreamKey={videoStreamKey}
            timezone={timezone}
            siteSlug={siteSlug}
            streamId={streamId}
          />
        )}
      </div>
    </>
  )
}

AlertModalWithSidebar.propTypes = propTypes
AlertModalWithSidebar.defaultProps = defaultProps

export default AlertModalWithSidebar
