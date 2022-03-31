import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import Modal from '@material-ui/core/Modal'
import Icon from 'react-icons-kit'
import { x } from 'react-icons-kit/feather/x'

// src
import PauseAlertLayout from './components/PauseAlertLayout'
import AreYouSureLayout from './components/AreYouSureLayout'
import useStyles from './styles'
import {
  closeModal,
  PauseAlertModalSliceType,
  pauseAlertThreatSignaturePeriodRequested,
} from './redux/pauseAlertModalSlice'

interface PauseAlertModalProps {
  darkMode: boolean
}

/* TODO(AMB-2276|@rys): put this in organisms/modals. Also, we don't need to pass in darkMode. Use theme. */

export default function PauseAlertModal({
  darkMode,
}: PauseAlertModalProps): JSX.Element {
  const dispatch = useDispatch()
  const { account }: { account: string } = useParams()
  const siteSlug = useSelector(
    (state: PauseAlertModalSliceType) => state.pauseAlertModal.siteSlug,
  )
  const threatSignatureId = useSelector(
    (state: PauseAlertModalSliceType) =>
      state.pauseAlertModal.threatSignatureId,
  )
  const threatSignatureName = useSelector(
    (state: PauseAlertModalSliceType) =>
      state.pauseAlertModal.threatSignatureName,
  )
  const streamId = useSelector(
    (state: PauseAlertModalSliceType) => state.pauseAlertModal.streamId,
  )
  const streamName = useSelector(
    (state: PauseAlertModalSliceType) => state.pauseAlertModal.streamName,
  )
  const modalOpen = useSelector(
    (state: PauseAlertModalSliceType) => state.pauseAlertModal.modalOpen,
  )
  const loading = useSelector(
    (state: PauseAlertModalSliceType) => state.pauseAlertModal.loading,
  )
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [description, setDescription] = useState<string | null>('')
  const [duration, setDuration] = useState<number>(0)
  const classes = useStyles({ darkMode, loading })

  const handleModalClose = () => {
    dispatch(closeModal())
    setSubmitted(false)
    setDescription(null)
    setDuration(0)
  }
  const handleDone = () => {
    // need to dispatch
    dispatch(
      pauseAlertThreatSignaturePeriodRequested({
        streamIds: [streamId],
        threatSignatureId,
        threatSignatureName,
        accountSlug: account,
        siteSlug,
        duration,
        description,
      }),
    )
    setSubmitted(false)
    setDescription(null)
    setDuration(0)
  }
  const handleCancel = () => {
    setSubmitted(false)
  }
  const title = submitted ? 'Are you sure?' : 'Pause an Alert'

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <div className={classes.root}>
        <div className={classes.title}>
          <div>{title}</div>
          <div
            className={classes.close}
            onClick={() => {
              if (!loading) handleModalClose()
            }}
            role='button'
            tabIndex={0}
            aria-describedby='close-button'
            onKeyDown={e => {
              if (e.keyCode === 13) {
                if (!loading) handleModalClose()
              }
            }}
          >
            <Icon icon={x} size={20} />
          </div>
        </div>
        {!submitted && !loading && (
          <PauseAlertLayout
            handleSubmit={(
              newDescription: string | null,
              newDuration: number,
            ) => {
              setSubmitted(true)
              setDuration(newDuration)
              setDescription(newDescription)
            }}
            threatSignatureName={threatSignatureName}
            streamName={streamName}
            selectedDescription={description}
            selectedDuration={duration}
            handleCancel={handleModalClose}
          />
        )}
        {(submitted || loading) && (
          <AreYouSureLayout
            handleDone={handleDone}
            handleCancel={handleCancel}
            loading={loading}
          />
        )}
      </div>
    </Modal>
  )
}
