import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import { useFormik } from 'formik'
import * as yup from 'yup'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// src
import {
  setProvisionNewModalValue,
  createNodeProvisionRequested,
} from 'pages/SkuManagement/redux'
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import AmbientTabs from 'components/Tabs'
import { Button } from 'ambient_ui'
import ConfirmDialog from 'components/ConfirmDialog'
import IP_VALIDATOR from 'common/validators/ip'

import DetailsPanel from './components/DetailsPanel'
import TabOne from './components/TabOne'
import TabTwo from './components/TabTwo'
import TabThree from './components/TabThree'
import TabFour from './components/TabFour'

// import useStyles from './styles'

interface Props {
  open: boolean
}
const validationSchema = yup.object({
  nodeIdentifier: yup
    .string('Enter a unique node identifier')
    .matches(/^\S+$/, { message: 'Node identifier cannot contain a space' })
    .required('Unique node identifier is required'),
  welcomeUserEmail: yup
    .string('Enter email')
    .email('Enter valid email of user'),
  retentionMotionDays: yup.number(),
  retentionNonmotionDays: yup.number(),
  skuId: yup.number().required(),
  staticIp: yup.string().matches(IP_VALIDATOR, {
    excludeEmptyString: true,
    message: 'Enter a valid IP, IP Range, or Subnet',
  }),
  subnet: yup
    .string()
    .matches(IP_VALIDATOR, {
      excludeEmptyString: true,
      message: 'Enter a valid IP, IP Range, or Subnet',
    })
    .nullable(),
  gateway: yup.string().matches(IP_VALIDATOR, {
    excludeEmptyString: true,
    message: 'Enter a valid IP, IP Range, or Subnet',
  }),
  dns: yup.string(),
  welcomeUserEmail: yup
    .string('Enter email')
    .email('Enter valid email of user'),
  // quantity: yup.number().integer().moreThan(0),
})

const DEFAULT_PARTNER = 'Velasea'

function ProvisionAddModal({ open }: Props): JSX.Element {
  // const classes = useStyles({ darkMode: true })
  const dispatch = useDispatch()
  const skuId = useSelector(state => state.skuManagement.provisionNewModal.id)
  const skus = useSelector(state => state.skuManagement.collection)
  const hardwarePartner =
    skus && skuId
      ? get(
          skus.find(s => s.id === skuId),
          'hardwarePartner',
        )
      : { name: DEFAULT_PARTNER }
  const tabIndex = useSelector(
    state => state.skuManagement.provisionNewModal.tabIndex,
  )
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const formik = useFormik({
    enableReinitialize: true, // allows for selector to be null then have values and reinitialize
    initialValues: {
      retentionMotionDays: 7,
      retentionNonmotionDays: 4,
      hardwarePartner: get(hardwarePartner, 'name'),
      skuId: parseInt(skuId, 10),
    },
    validationSchema,
  })

  const handleResetForm = () => {
    formik.resetForm()
    formik.setFieldValue('skuId', null)
    dispatch(
      setProvisionNewModalValue({
        id: null,
      }),
    )
  }

  // reset the formik state every time it's closed
  useEffect(() => {
    if (!open) {
      handleResetForm()
    }
  }, [open]) //eslint-disable-line

  const handleClose = () => {
    setIsConfirmOpen(false)
    dispatch(
      setProvisionNewModalValue({
        id: null,
        isOpen: false,
        tabIndex: 0,
      }),
    )
    handleResetForm()
  }

  const checkConfirm = () => {
    if (formik.dirty) {
      setIsConfirmOpen(true)
    } else {
      handleClose()
    }
  }

  const handleTabChange = (evt, newValue) => {
    dispatch(setProvisionNewModalValue({ tabIndex: newValue }))
  }

  const handleSubmit = formData => {
    const {
      nodeIdentifier,
      skuId: id,
      welcomeUserEmail,
      retentionMotionDays,
      retentionNonmotionDays,
      shippingInfo,
      shippingTrackingLink,
      purchaseOrder,
      comment,
      staticIp,
      subnet,
      gateway,
      dns,
      // quantity,
    } = formData

    dispatch(
      createNodeProvisionRequested({
        data: {
          nodeIdentifier,
          skuId: id,
          welcomeUserEmail,
          retentionMotionDays,
          retentionNonmotionDays,
          shippingInfo,
          shippingTrackingLink,
          purchaseOrder,
          comment,
          staticIp,
          subnet,
          gateway,
          dns,
        },
      }),
    )
  }

  return (
    <Modal open={open}>
      <BaseModalWrapper width='fit-content' height='fit-content'>
        <BaseModalTitle
          title='Provision Node from SKU'
          handleClose={checkConfirm}
        />
        <Box display='flex' flexDirection='row'>
          <div style={{ padding: 16, width: '100%' }}>
            <AmbientTabs
              labels={
                skuId
                  ? [
                      'Node Details',
                      'Provisioning Details',
                      'Node Admin',
                      'SKU Details',
                    ]
                  : ['Node Details', 'Provisioning Details', 'Node Admin']
              }
              handleChange={handleTabChange}
              activeIndex={tabIndex}
            />
          </div>
        </Box>
        <Box display='flex' flexDirection='row'>
          <>
            {tabIndex === 0 && <TabOne formik={formik} />}
            {tabIndex === 1 && <TabTwo formik={formik} />}
            {tabIndex === 2 && <TabThree formik={formik} />}
            {tabIndex === 3 && <TabFour />}
          </>
          <DetailsPanel quantity={1} />
        </Box>
        <Box display='flex' justifyContent='flex-end' pr={2}>
          <Button variant='text' onClick={checkConfirm}>
            Cancel
          </Button>
          <Button
            variant='contained'
            disabled={!isEmpty(formik.errors)}
            onClick={() => {
              handleSubmit(formik.values)
              handleClose()
            }}
          >
            Provision Node
          </Button>
        </Box>
        <ConfirmDialog
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleClose}
          content='Your changes will not be saved. Are you sure you want to exit?'
        />
      </BaseModalWrapper>
    </Modal>
  )
}

export default ProvisionAddModal
