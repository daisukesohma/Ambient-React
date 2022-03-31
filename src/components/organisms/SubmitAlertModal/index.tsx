import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import Icon from 'react-icons-kit'
import { x } from 'react-icons-kit/feather/x'

// src
import SubmitAlertLayout from './components/SubmitAlertLayout'
import {
  closeModal,
  createAlertErrorReportRequested,
} from './redux/submitAlertModalSlice'
import { SubmitAlertModalSliceType } from './types'
import useStyles from './styles'

interface SubmitAlertModalProps {
  darkMode: boolean
}

/* TODO(AMB-2276|@rys): put this in organisms/modals. Also, we don't need to pass in darkMode. Use theme.
Also, rename this to SubmitAlertFeedbackModal. Submit alert is not the same as submitting the feedback. */

export default function SubmitAlertModal({
  darkMode,
}: SubmitAlertModalProps): JSX.Element {
  const dispatch = useDispatch()

  const modalOpen = useSelector(
    (state: SubmitAlertModalSliceType) => state.submitAlertModal.modalOpen,
  )
  const loading = useSelector(
    (state: SubmitAlertModalSliceType) => state.submitAlertModal.loading,
  )
  const classes = useStyles({ loading })

  const title = 'Submit Alert Feedback'

  const handleModalClose = () => {
    dispatch(closeModal())
  }

  const handleSubmit = (feedback: string | null, radioOptionValue: string) => {
    dispatch(
      createAlertErrorReportRequested({
        reason: radioOptionValue,
        description: feedback,
      }),
    )
  }

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
        {/* TODO(AMB-2276|@rys): refactor into more resuable layout. Name it more generic to be reusable. */}
        <SubmitAlertLayout
          handleModalClose={handleModalClose}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Modal>
  )
}
