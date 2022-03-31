import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal } from '@material-ui/core'
import Icon from 'react-icons-kit'
import { x } from 'react-icons-kit/feather/x'
import { ENTER_KEY_CODE } from 'common/constants'
import { SubmitAlertModalSliceType } from 'components/organisms/SubmitAlertModal/types'
import { openModal as openPauseModal } from 'components/organisms/PauseAlertModal/redux/pauseAlertModalSlice'
import { closeModal } from 'components/organisms/modals/NoFacialRecognitionModal/redux/noFacialRecognitionModalSlice'
import { SettingsSliceProps } from 'redux/slices/settings'

import { NoFacialRecognitionModalSliceType } from './redux/noFacialRecognitionModalSlice'
import useStyles from './styles'

// TODO(AMB-2276|@rys & @stephen): rename this to something better & resuse AmbientModal
export default function NoFacialRecognitionModal(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })

  const streamId = useSelector(
    (state: SubmitAlertModalSliceType) => state.submitAlertModal.streamId,
  )
  const siteSlug = useSelector(
    (state: SubmitAlertModalSliceType) => state.submitAlertModal.siteSlug,
  )
  const threatSignatureId = useSelector(
    (state: SubmitAlertModalSliceType) =>
      state.submitAlertModal.threatSignatureId,
  )
  const threatSignatureName = useSelector(
    (state: SubmitAlertModalSliceType) =>
      state.submitAlertModal.threatSignatureName,
  )
  const streamName = useSelector(
    (state: SubmitAlertModalSliceType) => state.submitAlertModal.streamName,
  )
  const isOpen = useSelector(
    (state: NoFacialRecognitionModalSliceType) =>
      state.noFacialRecognitionModal.isOpen,
  )
  const handleModalClose = () => dispatch(closeModal())
  const openPauseAlertModal = () => {
    dispatch(
      openPauseModal({
        siteSlug,
        threatSignatureId,
        threatSignatureName,
        streamId,
        streamName,
      }),
    )
    handleModalClose()
  }
  return (
    <Modal open={isOpen} onClose={handleModalClose}>
      <div className={classes.root}>
        <div className={classes.title}>
          <div>Thank you for your feedback</div>
          {/* TODO(AMB-2276|@rys): close button can be atom. */}
          <div
            className={classes.close}
            onClick={handleModalClose}
            role='button'
            tabIndex={0}
            aria-describedby='close-button'
            onKeyDown={e => {
              if (e.keyCode === ENTER_KEY_CODE) {
                handleModalClose()
              }
            }}
          >
            <Icon icon={x} size={20} />
          </div>
        </div>
        {/* TODO(AMB-2276|@rys): refactor into more resuable layout. 
        This could be called molecules/modalLayouts/ModalDescriptionLayout.tsx etc.   */}
        <>
          {/* TODO(AMB-2277|@rys) Refactor to be atom */}
          <div className={classes.radioLabel}>
            Our AI models do not use any facial recognition or personally
            identifiable information which may lead to some additional
            notifications under certain circumstances. These alerts can be
            dismissed easily or you can choose to pause alerts temporarily.
          </div>
          {/* TODO(AMB-2277|@rys) Refactor to be atom */}
          <div className={classes.pauseAlert}>
            You can also choose to{' '}
            {/* TODO(AMB-2277|@rys) Refactor to be atom */}
            <div
              className={classes.pause}
              onClick={openPauseAlertModal}
              role='button'
              tabIndex={0}
              aria-describedby='pause-alert'
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  openPauseAlertModal()
                }
              }}
            >
              pause an alert
            </div>
            .
          </div>
          {/* TODO(AMB-2277|@rys): AMB-2277 Refactor to be atom. Also, buttons should reside in AmbientModal. 
      Layout should contain modal content.
       */}
          <div className={classes.buttons}>
            <Button
              variant='contained'
              className={classes.submit}
              onClick={handleModalClose}
            >
              Done
            </Button>
          </div>
        </>
      </div>
    </Modal>
  )
}
