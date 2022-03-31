import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { useFormik } from 'formik'
import { useAbility } from '@casl/react'
import * as yup from 'yup'
import Box from '@material-ui/core/Box'
import get from 'lodash/get'
// src
import { AbilityContext, Can } from 'rbac'
import {
  setEditModalValue,
  updateNodeAdminRequested,
  InventoryReducerProps,
} from 'pages/Inventory/redux'
import IP_VALIDATOR from 'common/validators/ip'
import { InventoryStatusEnum } from 'enums'
import getInventoryById from 'pages/Inventory/selectors/getInventoryById'
import statusDropDownOptions from 'pages/Inventory/selectors/statusDropDownOptions'
import { Button } from 'ambient_ui'
import { NODE_ADMIN } from 'pages/Inventory/saga/gql'
import TextFieldAmbient from 'components/TextFieldAmbient'

interface Props {
  checkConfirm(): any
}

const validationSchema = yup.object({
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
  // quantity: yup.number().integer().moreThan(0),
})

function TabThree({ checkConfirm }: Props): JSX.Element {
  const ability = useAbility(AbilityContext)
  const dispatch = useDispatch()
  const editId = useSelector(
    (state: InventoryReducerProps) => state.inventory.editModal.id,
  )
  const nodeProvision = useSelector(getInventoryById(editId))
  const { areFieldsDisabled } = useSelector(
    (state: InventoryReducerProps) => state.inventory.editModal,
  )

  const { data } = useQuery(NODE_ADMIN, {
    variables: { nodeIdentifier: get(nodeProvision, 'node.identifier') },
  })
  const nodeAdmin = get(data, 'nodeAdmin')

  const provisionStatuses = useSelector(
    statusDropDownOptions([
      (state: InventoryReducerProps) =>
        get(state, 'inventory.provisionStatuses', []),
    ]),
  )

  const formik = useFormik({
    enableReinitialize: true, // allows for selector to be null then have values and reinitialize
    initialValues: {
      guestUsername: get(nodeAdmin, 'guestUsername'),
      guestPassword: get(nodeAdmin, 'guestPassword'),
      macAddress: get(nodeAdmin, 'macAddress'),
      rootPassword: get(nodeAdmin, 'rootPassword'),
      staticIp: get(nodeAdmin, 'configuredStaticIp'),
      subnet: get(nodeAdmin, 'configuredSubnet'),
      gateway: get(nodeAdmin, 'configuredGateway'),
      dns: get(nodeAdmin, 'configuredDns'),
    },
    validationSchema,
  })

  useEffect(() => {
    dispatch(setEditModalValue({ isFormikDirty: formik.dirty }))
  }, [formik.dirty, dispatch])

  const handleConfirm = () => {
    const {
      guestUsername,
      guestPassword,
      macAddress,
      rootPassword,
      staticIp,
      subnet,
      gateway,
      dns,
    } = formik.values
    const updateData = {
      nodeIdentifier: get(nodeProvision, 'node.identifier'),
      data: {
        rootPassword,
        guestUsername,
        guestPassword,
        macAddress,
        staticIp,
        subnet,
        gateway,
        dns,
      },
    }

    dispatch(updateNodeAdminRequested(updateData))
  }

  const isNotInProvisionedStatus =
    provisionStatuses.find(s => s.value.id === get(nodeProvision, 'status'))
      .value.status !== InventoryStatusEnum.PROVISIONED
  const userCanEdit =
    ability.can('update', 'NodeProvision') && isNotInProvisionedStatus

  if (!nodeProvision) return null

  return (
    <>
      <Can I='view' on='NodeAdmin'>
        <Box p={3}>
          <div style={{ width: 450 }}>
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Root Password'
              id='rootPassword'
              onChange={formik.handleChange}
              label='Root Password'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Guest username'
              id='guestUsername'
              onChange={formik.handleChange}
              label='Guest username'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Guest password'
              id='guestPassword'
              onChange={formik.handleChange}
              label='Guest password'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Mac Address'
              id='macAddress'
              onChange={formik.handleChange}
              label='Mac Address'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Static Ip'
              id='staticIp'
              onChange={formik.handleChange}
              label='Static Ip'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Subnet'
              id='subnet'
              onChange={formik.handleChange}
              label='Subnet'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='Gateway'
              id='gateway'
              onChange={formik.handleChange}
              label='Gateway'
              withFormik
              formikObject={formik}
            />
            <TextFieldAmbient
              disabled={areFieldsDisabled || !userCanEdit}
              placeholder='DNS'
              id='dns'
              onChange={formik.handleChange}
              label='DNS'
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
      </Can>
      <Can not I='view' on='NodeAdmin'>
        <Box p={2}>
          <Box>
            <div
              className='am-caption'
              style={{ border: '1px solid gray', borderRadius: 4, padding: 8 }}
            >
              You don't have permission to perform this action
            </div>
          </Box>
        </Box>
      </Can>
    </>
  )
}

export default TabThree
