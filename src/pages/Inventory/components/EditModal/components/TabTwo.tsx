import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useAbility } from '@casl/react'
import * as yup from 'yup'
import Box from '@material-ui/core/Box'
import get from 'lodash/get'
// src
import { AbilityContext } from 'rbac'
import { InventoryStatusEnum } from 'enums'
import {
  setEditModalValue,
  updateNodeProvisionRequested,
  InventoryReducerProps,
} from 'pages/Inventory/redux'
import getInventoryById from 'pages/Inventory/selectors/getInventoryById'
import { Button } from 'ambient_ui'
import statusDropDownOptions from 'pages/Inventory/selectors/statusDropDownOptions'
import TextFieldAmbient from 'components/TextFieldAmbient'

interface Props {
  checkConfirm(): any
}

const validationSchema = yup.object({
  shippingTrackingLink: yup.string('Link').url(),
  welcomeUserEmail: yup
    .string('Enter email')
    .email('Enter valid email of user'),
})

function TabTwo({ checkConfirm }: Props): JSX.Element {
  const ability = useAbility(AbilityContext)
  const dispatch = useDispatch()
  const editId = useSelector(
    (state: InventoryReducerProps) => state.inventory.editModal.id,
  )
  const nodeProvision = useSelector(getInventoryById(editId))
  const { areFieldsDisabled } = useSelector(
    (state: InventoryReducerProps) => state.inventory.editModal,
  )
  const provisionStatuses = useSelector(
    statusDropDownOptions([
      (state: InventoryReducerProps) =>
        get(state, 'inventory.provisionStatuses', []),
    ]),
  )
  const formik = useFormik({
    enableReinitialize: true, // allows for selector to be null then have values and reinitialize
    initialValues: {
      comment: get(nodeProvision, 'comment'),
      provisioningKey: get(nodeProvision, 'provisioningKey'),
      purchaseOrder: get(nodeProvision, 'purchaseOrder'),
      retentionMotionDays: get(nodeProvision, 'node.retentionMotionDays'),
      retentionNonmotionDays: get(nodeProvision, 'node.retentionNonmotionDays'),
      shippingInfo: get(nodeProvision, 'shippingInfo'),
      shippingTrackingLink: get(nodeProvision, 'shippingTrackingLink'),
      welcomeUserEmail: get(nodeProvision, 'welcomeUser.email'),
    },
    validationSchema,
  })

  useEffect(() => {
    dispatch(setEditModalValue({ isFormikDirty: formik.dirty }))
  }, [formik.dirty, dispatch])

  if (!nodeProvision) return null

  const handleConfirm = () => {
    const {
      comment,
      purchaseOrder,
      retentionMotionDays,
      retentionNonmotionDays,
      shippingInfo,
      shippingTrackingLink,
      welcomeUserEmail,
    } = formik.values
    const data = {
      nodeProvisionId: nodeProvision.id,
      data: {
        comment,
        purchaseOrder,
        retentionMotionDays,
        retentionNonmotionDays,
        shippingInfo,
        shippingTrackingLink,
        welcomeUserEmail,
      },
    }

    dispatch(updateNodeProvisionRequested(data))

    // dispatch(
    //   setEditModalValue({
    //     id: null,
    //     isOpen: false,
    //   }),
    // )
  }

  const isNotInProvisionedStatus =
    provisionStatuses.find(s => s.value.id === get(nodeProvision, 'status'))
      .value.status !== InventoryStatusEnum.PROVISIONED
  const userCanEdit =
    ability.can('update', 'NodeProvision') && isNotInProvisionedStatus

  return (
    <>
      <Box p={3}>
        <div style={{ width: 450 }}>
          <TextFieldAmbient
            disabled={!userCanEdit}
            placeholder='Welcome user email'
            label='Welcome user email'
            id='welcomeUserEmail'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled={areFieldsDisabled || !userCanEdit}
            placeholder='Shipping Info (Destination)'
            id='shippingInfo'
            onChange={formik.handleChange}
            label='Shipping Info (Destination)'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled={!userCanEdit}
            placeholder='Shipping Tracking Link'
            id='shippingTrackingLink'
            onChange={formik.handleChange}
            label='Shipping Tracking Link'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled={!userCanEdit}
            placeholder='Purchase order'
            id='purchaseOrder'
            onChange={formik.handleChange}
            label='Purchase order'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled
            placeholder='Provisioning Key'
            id='provisioningKey'
            onChange={formik.handleChange}
            label='Provisioning Key'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled={!userCanEdit}
            placeholder='Comment'
            id='comment'
            onChange={formik.handleChange}
            label='Comment'
            withFormik
            formikObject={formik}
          />
        </div>
      </Box>
      {userCanEdit && (
        <Box display='flex' justifyContent='flex-end' pr={2}>
          <Button variant='text' onClick={checkConfirm}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleConfirm}>
            Save
          </Button>
        </Box>
      )}
    </>
  )
}

export default TabTwo
