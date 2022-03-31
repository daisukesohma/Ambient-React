import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAbility } from '@casl/react'
import Box from '@material-ui/core/Box'
import get from 'lodash/get'
import extend from 'lodash/extend'
// src
import { AbilityContext } from 'rbac'
import {
  setEditModalValue,
  updateNodeProvisionRequested,
  verifyNodeProvisionSetupRequested,
  InventoryReducerProps,
} from 'pages/Inventory/redux'
import { InventoryStatusEnum } from 'enums'
import getInventoryById from 'pages/Inventory/selectors/getInventoryById'
import { Button, CircularProgress, DropdownMenu, Icon } from 'ambient_ui'
import TextFieldAmbient from 'components/TextFieldAmbient'
import statusDropDownOptions from 'pages/Inventory/selectors/statusDropDownOptions'
import ConfirmDialog from 'components/ConfirmDialog'

interface Props {
  checkConfirm: () => void
}

const validationSchema = yup.object({
  nodeIdentifier: yup
    .string('Enter node identifier')
    .required('Node identifier is required'),
  welcomeUserEmail: yup
    .string('Enter email')
    .email('Enter valid email of user'),
  retentionMotionDays: yup.number(),
  retentionNonmotionDays: yup.number(),
})

// States in which the user's ability to select these statuses in Dropdown Menu
// should be disabled
const DISABLED_USER_SELECTION_STATUSES = [
  InventoryStatusEnum.PENDING_INSTALLATION,
  InventoryStatusEnum.READY_FOR_REVIEW,
  InventoryStatusEnum.ONLINE,
  InventoryStatusEnum.PROVISIONED,
]

function TabOne({ checkConfirm }: Props): JSX.Element {
  const { palette } = useTheme()
  const ability = useAbility(AbilityContext)
  const dispatch = useDispatch()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const {
    id: editId,
    isNodeProvisionSetupVerified,
    isNodeProvisionSetupLoading,
    nodeProvisionSetupReason,
    areFieldsDisabled,
  } = useSelector((state: InventoryReducerProps) => state.inventory.editModal)

  const provisionStatuses = useSelector(
    statusDropDownOptions([
      (state: InventoryReducerProps) =>
        get(state, 'inventory.provisionStatuses'),
    ]),
  )
  const [isSaveDisabled, setIsSaveDisabled] = useState(false)

  // Extending the provision status with { props: { disabled: true} } disables it from
  // Dropdown Menu selection
  //
  const provisionStatusesWithProps = provisionStatuses.map(s =>
    extend(s, {
      props: {
        disabled: DISABLED_USER_SELECTION_STATUSES.includes(s.value.status),
      },
    }),
  )

  const nodeProvision = useSelector(getInventoryById(editId))

  const formik = useFormik({
    enableReinitialize: true, // allows for selector to be null then have values and reinitialize
    initialValues: {
      status: get(nodeProvision, 'status'),
      sku: get(nodeProvision, 'node.hardwareSku.identifier'),
      hardwarePartner: get(
        nodeProvision,
        'node.hardwareSku.hardwarePartner.name',
      ),
      retentionMotionDays: get(nodeProvision, 'node.retentionMotionDays'),
      retentionNonmotionDays: get(nodeProvision, 'node.retentionNonmotionDays'),
      serialNumber: get(nodeProvision, 'node.hardwareSerialNumber'),
    },
    validationSchema,
  })

  useEffect(() => {
    dispatch(setEditModalValue({ isFormikDirty: formik.dirty }))
  }, [formik.dirty, dispatch])

  // Determine when to Disable Form fields
  // the gql query returns the statuses in the correct "show" order,
  // so we use index here to gain business logic
  const indexOfReadyToShip = provisionStatusesWithProps.findIndex(
    s => s.value.status === InventoryStatusEnum.READY_TO_SHIP,
  )
  const initialStatusReadyToShip =
    provisionStatusesWithProps.find(
      s => s.value.id === formik.initialValues.status,
    ).value.status === InventoryStatusEnum.READY_TO_SHIP
  const currentStatusReadyToShip =
    provisionStatusesWithProps.find(s => s.value.id === formik.values.status)
      .value.status === InventoryStatusEnum.READY_TO_SHIP

  // This checks the index of the status, since the provisionStatuses array is ORDERED
  // differently than the ids, the array ORDERING is what we are using to determine proper
  // status ordering. We store status DB id in `status.value.id`, and store that ID in `formik.initialValues.status`
  // We then compare that to the order (thru indexOfReadyToShip)
  //
  const isInitialStatusReadyToShipAndAfter =
    provisionStatusesWithProps.findIndex(
      s => s.value.id === formik.initialValues.status,
    ) >= parseInt(indexOfReadyToShip, 10)
  const isCurrentStatusReadyToShipAndAfter =
    provisionStatusesWithProps.findIndex(
      s => s.value.id === formik.values.status,
    ) >= parseInt(indexOfReadyToShip, 10)

  // Set disabled form fields with a state in redux so we can keep track of
  // it  across tabs
  //
  useEffect(() => {
    if (
      isInitialStatusReadyToShipAndAfter &&
      isCurrentStatusReadyToShipAndAfter
    ) {
      dispatch(setEditModalValue({ areFieldsDisabled: true }))
    } else {
      dispatch(setEditModalValue({ areFieldsDisabled: false }))
    }
  }, [
    formik.initialValues.status,
    formik.values.status,
    isInitialStatusReadyToShipAndAfter,
    isCurrentStatusReadyToShipAndAfter,
    dispatch,
  ])

  // if user changes to READY_TO_SHIP status, verify with backend it can be shipped
  useEffect(() => {
    if (currentStatusReadyToShip) {
      dispatch(verifyNodeProvisionSetupRequested({ id: editId }))
    }
  }, [formik.values.status, dispatch, currentStatusReadyToShip, editId])

  // disable save if change to READY_TO_SHIP but it's not verified
  const disableSave = currentStatusReadyToShip && !isNodeProvisionSetupVerified
  useEffect(() => {
    setIsSaveDisabled(disableSave)
  }, [formik.values.status, disableSave])

  if (!nodeProvision) return null

  const handleSave = () => {
    const data = {
      nodeProvisionId: nodeProvision.id,
      data: {
        // skuId: String
        status: formik.values.status,
        retentionMotionDays: formik.values.retentionMotionDays,
        retentionNonmotionDays: formik.values.retentionNonmotionDays,
      },
    }

    dispatch(updateNodeProvisionRequested(data))
    setIsConfirmOpen(false)
  }

  const checkSave = () => {
    if (!initialStatusReadyToShip && currentStatusReadyToShip) {
      setIsConfirmOpen(true)
    } else {
      handleSave()
    }
  }

  const handleStatusSelection = e => {
    dispatch(setEditModalValue({ isNodeProvisionSetupVerified: false })) // reset verified state
    formik.setFieldValue('status', e.value.id)
  }

  // If a user doesn't have edit permission, or status is PROVISIONED, make view-only
  const isNotInProvisionedStatus =
    provisionStatusesWithProps.find(
      s => s.value.id === formik.initialValues.status,
    ).value.status !== InventoryStatusEnum.PROVISIONED

  const userCanEdit =
    ability.can('update', 'NodeProvision') && isNotInProvisionedStatus

  return (
    <>
      <Box p={3}>
        <div style={{ width: 450 }}>
          <div style={{ marginBottom: 16, marginTop: -8 }}>
            <div className='am-caption' style={{ marginBottom: 8 }}>
              Status
            </div>
            <div
              style={{
                marginLeft: -8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <DropdownMenu
                disabled={!userCanEdit}
                menuItems={provisionStatusesWithProps}
                selectedItem={provisionStatusesWithProps.find(
                  item => item.value.id === formik.values.status,
                )}
                handleSelection={handleStatusSelection}
              />
              {isNodeProvisionSetupLoading && (
                <CircularProgress size='16' color='secondary' />
              )}
              {currentStatusReadyToShip &&
                !isNodeProvisionSetupLoading &&
                nodeProvisionSetupReason && (
                  <span
                    style={{
                      marginLeft: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      icon={
                        isNodeProvisionSetupVerified
                          ? 'checkCircle'
                          : 'alertCircle'
                      }
                      color={
                        isNodeProvisionSetupVerified
                          ? palette.primary.main
                          : palette.error.main
                      }
                      size={24}
                    />
                    <span
                      className='am-caption'
                      style={{ marginLeft: 8, color: palette.grey[500] }}
                    >
                      {isNodeProvisionSetupVerified ? 'Verified: ' : 'Error: '}
                      {nodeProvisionSetupReason}
                    </span>
                  </span>
                )}
            </div>
          </div>
          <TextFieldAmbient
            disabled
            placeholder='Hardware Partner'
            id='hardwarePartner'
            onChange={formik.handleChange}
            label='Hardware Partner'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled
            placeholder='SKU'
            id='sku'
            onChange={formik.handleChange}
            label='SKU'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled
            placeholder='Serial Number'
            id='serialNumber'
            onChange={formik.handleChange}
            label='Serial Number'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled={areFieldsDisabled}
            placeholder='Motion Retention Days'
            id='retentionMotionDays'
            onChange={formik.handleChange}
            label='Motion Retention Days'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            disabled={areFieldsDisabled}
            placeholder='Nonmotion Retention Days'
            id='retentionNonmotionDays'
            onChange={formik.handleChange}
            label='Nonmotion Retention Days'
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
          <Button
            disabled={isSaveDisabled}
            variant='contained'
            onClick={checkSave}
          >
            Save
          </Button>
        </Box>
      )}
      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSave}
        content={`After transitioning Ready to Ship status, you will not be able to edit Node Details, Node Admin or Destination: ${get(
          nodeProvision,
          'shippingInfo',
          'None',
        )}. Do you want to continue?`}
      />
    </>
  )
}

export default TabOne
