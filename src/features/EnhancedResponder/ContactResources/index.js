import React, { useEffect } from 'react'
import { batch, useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button } from 'ambient_ui'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import get from 'lodash/get'
// src
import { Modal } from '@material-ui/core'
import CheckinModal from 'features/EnhancedResponder/CheckinModal'
import ConfirmDialog from 'components/ConfirmDialog'
import {
  setCheckinModalOpen,
  fetchUsersRequested,
  fetchContactResourcesRequested,
} from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'
import { fetchSitesRequested } from 'redux/slices/operatorPage'
import { createNotification } from 'redux/slices/notifications'
import { Can } from 'rbac'

import CreateContactModal from './components/CreateContactModal'
import UpdateContactModal from './components/UpdateContactModal'
import ContactTable from './Contacts/ContactTable/index'
import { useStyles } from './styles'
import {
  openCreateModal,
  closeCreateModal,
  openDeleteModal,
  closeDeleteModal,
  openUpdateModal,
  closeUpdateModal,
  fetchContactsRequested,
  deleteContactRequested,
} from './contactResourcesSlice'
import LoadingScreen from '../../../containers/LoadingScreen'

export default function ContactResources() {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const contacts = useSelector(state => state.contactResources.contacts)
  const { account: accountSlug } = useParams()
  const createModalOpened = useSelector(
    state => state.contactResources.createModalOpened,
  )
  const deleteModalOpened = useSelector(
    state => state.contactResources.deleteModalOpened,
  )
  const updateModalOpened = useSelector(
    state => state.contactResources.updateModalOpened,
  )
  const contactsLoading = useSelector(
    state => state.contactResources.contactsLoading,
  )

  const usersLoading = useSelector(state => state.checkinModal.usersLoading)
  const sitesLoading = useSelector(state => state.operatorPage.sitesLoading)
  const contactResourcesLoading = useSelector(
    state => state.checkinModal.contactResourcesLoading,
  )
  const contactToDelete = useSelector(
    state => state.contactResources.contactToDelete,
  )
  const deleteContactLoading = useSelector(
    state => state.contactResources.deleteContactLoading,
  )

  useEffect(() => {
    batch(() => {
      dispatch(fetchContactsRequested({ accountSlug }))
      dispatch(fetchUsersRequested({ accountSlug }))
      dispatch(fetchContactResourcesRequested({ accountSlug }))
      dispatch(fetchSitesRequested({ accountSlug }))
    })
  }, [accountSlug, dispatch])

  const handleCreateModalOpen = () => {
    dispatch(openCreateModal())
  }

  const onContactUpdate = contact => {
    if (
      !get(contact, 'status') ||
      get(contact, 'status.endWorkShift') !== null
    ) {
      dispatch(openUpdateModal({ contact }))
    } else {
      dispatch(
        createNotification({
          message:
            'Contact Resource is in use. Please checkout contact resource first.',
        }),
      )
    }
  }

  const onContactDelete = contact => {
    if (
      !get(contact, 'status') ||
      get(contact, 'status.endWorkShift') !== null
    ) {
      dispatch(openDeleteModal({ contact }))
    } else {
      dispatch(
        createNotification({
          message:
            'Contact Resource is in use. Please checkout contact resource first.',
        }),
      )
    }
  }

  const handleDeleteContact = () => {
    const input = {
      id: contactToDelete.id,
    }
    dispatch(deleteContactRequested({ input }))
  }

  const onContactAssign = contact => {
    if (usersLoading || contactResourcesLoading || sitesLoading) {
      dispatch(createNotification({ message: 'Loading...' }))
      return
    }

    const siteSlug =
      get(contact, 'site.slug', null) === null &&
      get(contact, 'status.endWorkShift.workShiftPeriodEnded', null) === null
        ? get(contact, 'status.site.slug', null)
        : get(contact, 'site.slug', null)

    dispatch(
      setCheckinModalOpen({
        checkinModalOpen: true,
        contactResourceId: parseInt(contact.id, 10),
        contactResourceReadOnly: true,
        responderId:
          get(contact, 'status.endWorkShift.workShiftPeriodEnded', null) ===
          null
            ? get(contact, 'status.profile.id', null)
            : null,
        siteSlug,
        siteReadOnly: get(contact, 'site.slug', null) !== null,
      }),
    )
  }

  // if (contactsLoading) return <Skeleton />
  if (contactsLoading) return <LoadingScreen />

  return (
    <div>
      <Grid container justify='space-between'>
        <h3
          className={clsx(classes.title, 'am-h4')}
          style={{ margin: '16px 0' }}
        >
          Contact Resources
        </h3>
        <Can I='create' on='ContactResources'>
          <Button
            onClick={handleCreateModalOpen}
            customStyle={{ marginTop: 20 }}
          >
            Add Contact Resource
          </Button>
        </Can>
      </Grid>
      <ContactTable
        contacts={contacts}
        showAddNowButton={false}
        darkMode={darkMode}
        onContactDelete={onContactDelete}
        onContactUpdate={onContactUpdate}
        onContactAssign={onContactAssign}
        emptyComment='You currently have no items.'
        loading={usersLoading || sitesLoading}
      />
      <Modal
        open={createModalOpened}
        onClose={closeCreateModal}
        disableEnforceFocus
      >
        <CreateContactModal />
      </Modal>
      <ConfirmDialog
        open={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteContact}
        loading={deleteContactLoading}
        content={
          contactToDelete &&
          `You are about to delete contact resource "${contactToDelete.name}".
          Are you sure you want to do this?`
        }
      />
      <Modal
        open={updateModalOpened}
        onClose={closeUpdateModal}
        disableEnforceFocus
      >
        <UpdateContactModal />
      </Modal>
      <CheckinModal noButton />
    </div>
  )
}
