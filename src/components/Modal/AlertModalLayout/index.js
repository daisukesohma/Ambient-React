import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { isMobileOnly } from 'react-device-detect'
// src
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import { MixPanelEventEnum } from 'enums'
import AlertModalWithSidebar from './AlertModalWithSidebar'
import AlertModalV1 from './AlertModalV1'

const propTypes = {
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
  alertTs: PropTypes.number,
  coordinates: PropTypes.object,
  alertName: PropTypes.string,
  alertInstances: PropTypes.array,
  alertClip: PropTypes.string,
  hideAlertTimeline: PropTypes.bool,
  hideAlertModalControls: PropTypes.bool,
  hideResponderList: PropTypes.bool,
  canRecall: PropTypes.bool,
  deviceId: PropTypes.string,
}

const defaultProps = {
  handleClose: () => {},
  isHigh: false,
  hideAlertTimeline: false,
  hideAlertModalControls: false,
  hideResponderList: false,
  canRecall: false,
  deviceId: null,
}

const AlertModalLayout = ({
  accountSlug,
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
  alertTs,
  coordinates,
  alertName,
  alertInstances,
  alertClip,
  hideAlertTimeline,
  hideAlertModalControls,
  hideResponderList,
  canRecall,
  deviceId,
}) => {
  const { palette } = useTheme()

  useMixpanel(MixPanelEventEnum.VMS_OPENED, { siteName })

  const renderAlertModalV1 = (props = {}) => {
    return (
      <AlertModalV1
        accountSlug={accountSlug}
        isHigh={isHigh}
        alertEventId={alertEventId}
        alertEventHash={alertEventHash}
        siteSlug={siteSlug}
        streamId={streamId}
        nodeId={nodeId}
        timezone={timezone}
        initTs={initTs}
        siteName={siteName}
        streamName={streamName}
        alertTs={alertTs}
        coordinates={coordinates}
        alertName={alertName}
        alertInstances={alertInstances}
        alertClip={alertClip}
        deviceId={deviceId}
        {...props}
      />
    )
  }

  if (isMobileOnly) return renderAlertModalV1()

  if (streamId) {
    return (
      <AlertModalWithSidebar
        accountSlug={accountSlug}
        alertInstances={alertInstances}
        handleClose={handleClose}
        isHigh={isHigh}
        alertEventId={alertEventId}
        alertEventHash={alertEventHash}
        siteSlug={siteSlug}
        streamId={streamId}
        nodeId={nodeId}
        timezone={timezone}
        initTs={initTs}
        siteName={siteName}
        streamName={streamName}
        alertTs={alertTs}
        coordinates={coordinates}
        alertName={alertName}
        hideAlertTimeline={hideAlertTimeline}
        hideAlertModalControls={hideAlertModalControls}
        hideResponderList={hideResponderList}
        canRecall={canRecall}
        deviceId={deviceId}
      />
    )
  }

  // TODO: create separate Alert Modal Layout for VMS V4 which hasn't streams
  return (
    <div id='alert-modal-root' style={{ gridArea: '1/1/1/26' }}>
      {renderAlertModalV1({ color: palette.common.white })}
    </div>
  )
}

AlertModalLayout.propTypes = propTypes
AlertModalLayout.defaultProps = defaultProps

export default AlertModalLayout
