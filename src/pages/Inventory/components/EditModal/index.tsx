import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import get from 'lodash/get'
// src
import { setEditModalValue, InventoryReducerProps } from 'pages/Inventory/redux'
import { setProvisionNewModalValue } from 'pages/SkuManagement/redux'
import getInventoryById from 'pages/Inventory/selectors/getInventoryById'
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import AmbientTabs from 'components/Tabs'
import ConfirmDialog from 'components/ConfirmDialog'
import TabFour from 'pages/SkuManagement/components/AddModal/components/TabFour'

import TabOne from './components/TabOne'
import TabTwo from './components/TabTwo'
import TabThree from './components/TabThree'

// import useStyles from './styles'

interface Props {
  open: boolean
}

function EditModal({ open }: Props): JSX.Element {
  // const classes = useStyles({ darkMode: true })
  const dispatch = useDispatch()
  const {
    id: editId,
    tabIndex,
    isFormikDirty,
    isConfirmTabChangeOpen,
    nextTabIndex,
    isConfirmOpen,
  } = useSelector((state: InventoryReducerProps) => state.inventory.editModal)
  const nodeProvision = useSelector(getInventoryById(editId))

  // for Sku Details tab, we need to  set ID in the Sku reducer (cross-polinating reducers)
  const skuId = get(nodeProvision, 'node.hardwareSku.id')
  useEffect(() => {
    dispatch(setProvisionNewModalValue({ id: skuId }))
  }, [dispatch, skuId])

  if (!nodeProvision) return <></>

  const handleClose = () => {
    dispatch(
      setEditModalValue({
        id: null,
        isOpen: false,
        isFormikDirty: false,
        isConfirmOpen: false,
        tabIndex: 0,
        isNodeProvisionSetupVerified: false,
        nodeProvisionSetupReason: null, // this is being overloaded, we can separate out another state which is hasVerified or run the check
        areFieldsDisabled: false,
      }),
    )
  }

  const checkConfirm = () => {
    if (isFormikDirty) {
      dispatch(setEditModalValue({ isConfirmOpen: true }))
    } else {
      handleClose()
    }
  }

  const handleTabChange = (newTabIndex: number) => {
    dispatch(setEditModalValue({ tabIndex: newTabIndex }))
  }

  const checkTabChange = (e, newIndex: number) => {
    if (isFormikDirty) {
      dispatch(
        setEditModalValue({
          isConfirmTabChangeOpen: true,
          nextTabIndex: newIndex,
        }),
      )
    } else {
      handleTabChange(newIndex)
    }
  }

  return (
    <Modal open={open}>
      <BaseModalWrapper width='fit-content' height='fit-content'>
        <BaseModalTitle
          title={nodeProvision.node.name}
          handleClose={checkConfirm}
        />
        <Box display='flex' flexDirection='row'>
          <div style={{ padding: 16, width: '100%' }}>
            <AmbientTabs
              labels={[
                'Node Details',
                'Provisioning Details',
                'Node Admin',
                'SKU Details',
              ]}
              handleChange={checkTabChange}
              activeIndex={tabIndex}
            />
          </div>
        </Box>
        {tabIndex === 0 && <TabOne checkConfirm={checkConfirm} />}
        {tabIndex === 1 && <TabTwo checkConfirm={checkConfirm} />}
        {tabIndex === 2 && <TabThree checkConfirm={checkConfirm} />}
        {tabIndex === 3 && <TabFour />}
        <ConfirmDialog
          open={isConfirmOpen}
          onClose={() => dispatch(setEditModalValue({ isConfirmOpen: false }))}
          onConfirm={handleClose}
          content='Your changes will be lost if you exit. Do you want to continue?'
        />
        <ConfirmDialog
          open={isConfirmTabChangeOpen}
          onClose={() => {
            dispatch(setEditModalValue({ isConfirmTabChangeOpen: false }))
          }}
          onConfirm={() => {
            dispatch(setEditModalValue({ isConfirmTabChangeOpen: false }))
            handleTabChange(nextTabIndex)
          }}
          content='Your changes will be lost if you exit. Do you want to continue?'
        />
      </BaseModalWrapper>
    </Modal>
  )
}

export default EditModal
