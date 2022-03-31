/*
 *  Modal Component which runs the framework
 *  A single modal for all modals --> Modal is just a way to serving information rather than separate components
 *  Modal contents is determined by the redux state and then based on the type render the proper contents
 *
 *  rodaan@ambient.ai
 */
import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import RawModal from '@material-ui/core/Modal'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'
import { isMobile, isMobileOnly } from 'react-device-detect'
import clsx from 'clsx'
import get from 'lodash/get'
// src
import { hideModal } from 'redux/slices/modal'
import { setActiveAlert } from 'redux/slices/operatorPage'
import { cleanupVideoStreamControls } from 'redux/slices/videoStreamControls'
import { ModalTypeEnum } from 'enums'

import SecurityPostureModalLayout from '../../features/SecurityPosturePanel/components/SecurityPostureModalLayout'

import AlertModalLayout from './AlertModalLayout'
import VideoModalLayout from './VideoModalLayout'
import VideoModalV2Layout from './VideoModalV2Layout'
import ConfirmModalLayout from './ConfirmModalLayout'
import useStyles from './styles'
import { msToUnix, parseLatLng } from 'utils'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'
import RespondersModal from './RespondersModal'

const { Close } = Icons

const propTypes = {
  isChildOpen: PropTypes.bool,
  children: PropTypes.element,
  childType: PropTypes.string,
  handleChildClose: PropTypes.func,
  showCloseIcon: PropTypes.bool,
  customStyle: PropTypes.object,
  autoDarkMode: PropTypes.bool,
}

const defaultProps = {
  childType: undefined,
  handleChildClose: () => {},
  customStyle: {},
  showCloseIcon: true,
  autoDarkMode: false, // set this property to `true` if you want to allow modal window to check global state of darkMode (state.settings.darkMode)
}

function Modal({
  isChildOpen,
  childType,
  handleChildClose,
  children,
  showCloseIcon,
  customStyle,
  autoDarkMode,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const { account } = useParams()
  const open = useSelector(state => state.modal.open)
  const data = useSelector(state => state.modal.data)
  const modalType = useSelector(state => state.modal.type)
  const accountSlug = account || get(data, 'accountSlug')

  const isVideoModalV2 = !isMobileOnly

  const closeCallback = useSelector(state =>
    get(state, 'modal.data.closeCallback', () => {}),
  )
  const mainDarkMode = useSelector(state => state.settings.darkMode)
  const vmsDarkMode = useSelector(state => state.vms.darkMode)

  // modalTypes
  const isConfirm =
    modalType === ModalTypeEnum.CONFIRM || childType === ModalTypeEnum.CONFIRM
  const isVideo = modalType === ModalTypeEnum.VIDEO
  const isAlert =
    modalType === ModalTypeEnum.ALERT || modalType === ModalTypeEnum.HIGH_ALERT
  const isPauser = modalType === ModalTypeEnum.PAUSE

  const isResponders = modalType === ModalTypeEnum.RESPONDERS

  const classes = useStyles({
    isConfirm,
    isDarkMode:
      (autoDarkMode && mainDarkMode) ||
      vmsDarkMode ||
      (mainDarkMode && isPauser),
    isMobile,
    isVideo,
    isAlert,
    isPauser,
    isResponders,
  })
  const modalContainerClass = clsx(classes.modalPaper, {
    [classes.modalVideo]: isVideo,
    [classes.modalConfirm]: isConfirm,
    [classes.modalVideoV2]:
      isVideoModalV2 &&
      [
        ModalTypeEnum.ALERT,
        ModalTypeEnum.HIGH_ALERT,
        ModalTypeEnum.VIDEO,
      ].includes(modalType),
  })

  const onClose = () => {
    if (modalType) {
      dispatch(hideModal())
      if (isVideo || isAlert) {
        dispatch(
          cleanupVideoStreamControls({
            videoStreamKey: 'modal',
          }),
        )
      }
    } else {
      handleChildClose()
    }
    closeCallback()
    dispatch(setActiveAlert({ alert: null }))
    if (isVideo || isAlert) trackEventToMixpanel(MixPanelEventEnum.VMS_CLOSED)

    // can pass in closeButtonOverride inside modal content (in showModal)
    // to override the modal close button's action
    //
    if (data && data.closeButtonOverride) {
      data.closeButtonOverride()
    }
  }

  let modalContents = <div>Contents</div>

  // Modal contents is determined by the type of modal to display
  if (isAlert) {
    const { alertEvent } = data
    const alert = alertEvent.alert
    const alertEventId = alertEvent.id
    const alertEventHash =
      alertEvent.eventHash || alertEvent.alert_hash || alertEvent.alertHash
    const alertClip = alertEvent.clip
    const alertInstances = alertEvent.alertInstances ||
      alertEvent.alert_instances || [alertEvent]
    const canRecall = alertEvent.canRecall
    const alertName = alert.name
    const siteName = alert.site.name
    const siteSlug = alert.site.slug
    const streamName =
      get(alert, 'stream.name') || get(alertEvent, 'stream.name')
    const streamId = get(alert, 'stream.id') || get(alertEvent, 'stream.id')
    const coordinates = parseLatLng(get(alert, 'site.latlng'))
    const nodeId =
      get(alert, 'stream.node.identifier') ||
      get(alertEvent, 'stream.node.identifier')
    const timezone =
      get(alert, 'stream.site.timezone') ||
      get(alertEvent, 'stream.site.timezone')
    const initTs = msToUnix(
      alertEvent.tsIdentifier ||
        get(alertInstances, '[0].tsIdentifier') ||
        get(alertInstances, '[0].ts_identifier'),
    )
    const deviceId = get(alertEvent, 'accessReader.deviceId')
    const alertTs = initTs || alertEvent.tsCreated || alertEvent.ts_created

    modalContents = (
      <AlertModalLayout
        accountSlug={accountSlug}
        handleClose={onClose}
        isHigh={modalType === ModalTypeEnum.HIGH_ALERT}
        alertEventId={alertEventId}
        alertEventHash={alertEventHash}
        siteSlug={siteSlug}
        streamId={streamId}
        nodeId={nodeId}
        timezone={timezone}
        initTs={initTs}
        siteName={siteName}
        streamName={streamName}
        alertName={alertName}
        alertTs={alertTs}
        coordinates={coordinates}
        alertInstances={alertInstances}
        alertClip={alertClip}
        canRecall={canRecall}
        deviceId={deviceId}
      />
    )
  } else if (isVideo) {
    const {
      siteName,
      streamName,
      streamId,
      nodeId,
      siteSlug,
      initTs,
      tsTimelineHighlight,
      isZoomInInit,
      timezone,
    } = data
    const VideoModal = isVideoModalV2 ? VideoModalV2Layout : VideoModalLayout
    modalContents = (
      <VideoModal
        isDarkMode={vmsDarkMode}
        streamName={streamName}
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        siteName={siteName}
        streamId={streamId}
        nodeIdentifier={nodeId}
        initTs={initTs}
        tsTimelineHighlight={tsTimelineHighlight}
        isZoomInInit={isZoomInInit}
        timezone={timezone}
        handleClose={onClose}
      />
    )
  } else if (isConfirm) {
    modalContents = <ConfirmModalLayout />
  } else if (isPauser) {
    modalContents = <SecurityPostureModalLayout handleClose={onClose} />
  } else if (isResponders) {
    modalContents = <RespondersModal alertEventId={data.alertEventId} alertEventHash={data.alertEventHash}/>
  } else {
    modalContents = children
  }

  if (!(open || isChildOpen)) return false

  return (
    <RawModal open={open || isChildOpen} onClose={onClose} disableEnforceFocus>
      <div className={modalContainerClass} style={customStyle}>
        {modalContents}

        {showCloseIcon &&
        !isConfirm &&
        !(
          isVideoModalV2 &&
          [ModalTypeEnum.VIDEO].includes(modalType) &&
          get(data, 'streamId')
        ) && // TODO: couple conditions to hide close button
        !(
          isVideoModalV2 &&
          [ModalTypeEnum.ALERT, ModalTypeEnum.HIGH_ALERT].includes(modalType) &&
          get(data, 'alertEvent.stream.id')
        ) && ( // TODO: just while we support AlertModalV1
            <div className={classes.modalCloseBtn} onClick={onClose}>
              <Close stroke={palette.grey[700]} width={25} height={25} />
            </div>
          )}
      </div>
    </RawModal>
  )
}

Modal.propTypes = propTypes
Modal.defaultProps = defaultProps

export default Modal
