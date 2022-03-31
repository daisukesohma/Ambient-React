/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React from 'react'
import Modal from '@material-ui/core/Modal'
import { useSelector } from 'react-redux'

// src
import AlertModalLayout from '../../Modal/AlertModalLayout'

import useStyles from './styles'

// NOTE: import it from reducers in future
export interface SettingsState {
  settings: {
    darkMode: boolean
  }
}

interface Props {
  open: boolean
  onClose: () => void
  accountSlug: string
  alertInstances: Array<any>
  handleClose: () => void
  isHigh: boolean
  alertEventId: number
  alertEventHash: string
  siteSlug: string
  streamId: number
  nodeId: number
  timezone: string
  initTs: number
  siteName: string
  streamName: string
  alertTs: number
  coordinates: any
  alertName: string
  hideAlertTimeline: boolean
  hideAlertModalControls: boolean
  hideResponderList: boolean
  canRecall: boolean
}

function AlertVMSModal({
  open = false,
  onClose = () => {},
  accountSlug,
  alertInstances,
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
  hideAlertTimeline,
  hideAlertModalControls,
  hideResponderList,
  canRecall,
}: Props): JSX.Element {
  const darkMode = useSelector(
    (state: SettingsState) => state.settings.darkMode,
  )

  const classes = useStyles({ darkMode })

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <div className={classes.modalVideoV2}>
        <AlertModalLayout
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
        />
      </div>
    </Modal>
  )
}

export default AlertVMSModal
