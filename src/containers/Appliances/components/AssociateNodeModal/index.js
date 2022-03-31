import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Box from '@material-ui/core/Box'
import isEmpty from 'lodash/isEmpty'
import Modal from '@material-ui/core/Modal'
// src
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import {
  associateNodeToAccountRequested,
  setAssociateModalValue,
} from 'redux/slices/appliances'
import { Button } from 'ambient_ui'
import TextFieldAmbient from 'components/TextFieldAmbient'

const validationSchema = yup.object({
  applianceName: yup
    .string('Enter appliance name')
    .required('Appliance name is required'),
  accountName: yup
    .string('Account name is required')
    .required('Account name is required'),
  serialNumber: yup
    .string('Enter serial number')
    .length(12, 'Serial number should be valid format')
    .required('Enter valid serial number'),
})

function AssociateNodeModal({ open }) {
  const dispatch = useDispatch()
  const { account } = useParams()

  const isLoading = useSelector(
    state => state.appliances.associateNodeToAccountLoading,
  )
  const defaultSerialNumber = useSelector(
    state => state.appliances.associateNodeModal.serialNumber,
  )

  const formik = useFormik({
    enableReinitialize: true, // allows for selector to be null then have values and reinitialize
    initialValues: {
      applianceName: '',
      serialNumber: defaultSerialNumber,
      accountName: account,
    },
    validationSchema,
  })

  const handleResetForm = () => {
    formik.resetForm()
    dispatch(setAssociateModalValue({ serialNumber: null }))
  }

  // reset the formik state every time it's closed
  useEffect(() => {
    if (!open) {
      handleResetForm()
    }
  }, [open]) //eslint-disable-line

  const handleSave = () => {
    const { serialNumber, applianceName } = formik.values

    dispatch(
      associateNodeToAccountRequested({
        serialNumber,
        nodeName: applianceName,
        accountSlug: account,
      }),
    )
  }

  const onCancel = () => {
    dispatch(setAssociateModalValue({ isOpen: false }))
  }

  return (
    <Modal open={open}>
      <BaseModalWrapper width='fit-content' height='fit-content'>
        <BaseModalTitle
          title='Associate Appliance to Account'
          handleClose={onCancel}
        />
        <Box p={3}>
          <div style={{ width: 450 }}>
            <TextFieldAmbient
              disabled
              placeholder='Account Name to Associate'
              id='accountName'
              onChange={formik.handleChange}
              label='Account Name to Associate'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              placeholder='Appliance Serial Number'
              id='serialNumber'
              onChange={formik.handleChange}
              label='Appliance Serial Number'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              placeholder='Appliance Name'
              id='applianceName'
              onChange={formik.handleChange}
              label='Appliance Name'
              withFormik
              formikObject={formik}
            />
          </div>
        </Box>
        <Box display='flex' justifyContent='flex-end' pr={2}>
          <Button variant='text' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={!isEmpty(formik.errors) && !isLoading}
            variant='contained'
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </BaseModalWrapper>
    </Modal>
  )
}

export default AssociateNodeModal
