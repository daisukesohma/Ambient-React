import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import Box from '@material-ui/core/Box'
import { selectAccessReader } from 'features/StreamConfiguration/streamConfigurationSlice'
import AvailableAccessReaderList from './components/AvailableAccessReaderList'
import EditSelectedAccessReader from './components/EditSelectedAccessReader'

function AddAccessReaderModal({ open, handleClose }) {
  const dispatch = useDispatch()
  const selectedAccessReaderId = useSelector(
    state => state.streamConfiguration.selectedAccessReaderId,
  )
  const handleCloseAndClear = () => {
    handleClose()
    dispatch(selectAccessReader({ id: null }))
  }

  return (
    <Modal open={open}>
      <BaseModalWrapper width='fit-content' height={600}>
        <BaseModalTitle
          title='Access Readers'
          handleClose={handleCloseAndClear}
        />
        <Box mt={1} width={500} pl={2} pr={2}>
          <Box mt={3}>
            {selectedAccessReaderId && <EditSelectedAccessReader />}
            {!selectedAccessReaderId && <AvailableAccessReaderList />}
          </Box>
        </Box>
      </BaseModalWrapper>
    </Modal>
  )
}

export default AddAccessReaderModal
