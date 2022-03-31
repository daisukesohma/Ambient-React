import React, { useEffect, useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import clsx from 'clsx'
import DataTable from 'components/organisms/DataTable'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { Modal } from '@material-ui/core'
import { Button } from 'ambient_ui'

import tableDataSelector from '../../../selectors/externalContacts/tableData'

import {
  openCreateModal,
  closeCreateModal,
  openUpdateModal,
  closeUpdateModal,
  openDeleteModal,
  closeDeleteModal,
  fetchContactsRequested,
} from './externalContactsSlice'
import CreateExternalProfileModal from './components/CreateExternalProfileModal'
import UpdateExternalProfileModal from './components/UpdateExternalProfileModal'
import DeleteExternalProfileModal from './components/DeleteExternalProfileModal'
import makeStyles from './styles'

export default function ExternalProfiles() {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const { account } = useParams()

  const tableData = useSelector(tableDataSelector)
  const contactsLoading = useSelector(
    state => state.externalContacts.contactsLoading,
  )
  const darkMode = useSelector(state => state.settings.darkMode)
  const createModalOpen = useSelector(
    state => state.externalContacts.createModalOpen,
  )
  const updateModalOpen = useSelector(
    state => state.externalContacts.updateModalOpen,
  )
  const deleteModalOpen = useSelector(
    state => state.externalContacts.deleteModalOpen,
  )

  const classes = makeStyles({ darkMode })

  const renderEditIcon = () => (
    <EditIcon
      style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
    />
  )
  const renderDeleteIcon = () => (
    <DeleteIcon
      style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
    />
  )

  const tableColumns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Email', field: 'email' },
      { title: 'Phone number', field: 'phoneNumber' },
    ],
    [],
  )

  const tableOptions = useMemo(
    () => ({
      search: true,
      paging: true,
      sorting: true,
      actionsColumnIndex: -1,
      addRowPosition: 'first',
    }),
    [],
  )

  const onUserUpdate = contact => {
    dispatch(openUpdateModal({ contact }))
  }

  const onUserDelete = contact => {
    dispatch(openDeleteModal({ contact }))
  }

  const handleCreateModalClose = () => {
    dispatch(closeCreateModal())
  }
  const handleCreateModalOpen = () => {
    dispatch(openCreateModal())
  }
  const handleDeleteModalClose = () => {
    dispatch(closeDeleteModal())
  }
  const handleUpdateModalClose = () => {
    dispatch(closeUpdateModal())
  }

  const actions = [
    {
      icon: renderEditIcon,
      tooltip: 'Edit',
      onClick: (e, contact) => {
        onUserUpdate(contact)
      },
    },
    {
      icon: renderDeleteIcon,
      tooltip: 'Delete',
      onClick: (e, contact) => onUserDelete(contact),
    },
  ]

  useEffect(() => {
    dispatch(fetchContactsRequested({ accountSlug: account }))
  }, [account, dispatch])

  const table = (
    <DataTable
      title=''
      darkMode={darkMode}
      actions={actions}
      data={tableData}
      columns={tableColumns}
      options={{
        ...tableOptions,
      }}
      emptyComment='No external contacts.'
      showAddNowButton={false}
      defaultRowsPerPage={10}
    />
  )

  const content = contactsLoading ? <LinearProgress /> : table

  return (
    <Grid container>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <h3
          className={clsx('am-h4', classes.title, classes.textColor)}
          style={{ margin: '16px 0' }}
        >
          External Contacts
        </h3>
        <Button
          onClick={handleCreateModalOpen}
          customStyle={{ marginTop: 20, float: 'right' }}
        >
          Add Contact Resource
        </Button>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {content}
      </Grid>
      <Modal open={createModalOpen} onClose={handleCreateModalClose}>
        <CreateExternalProfileModal />
      </Modal>
      <Modal open={updateModalOpen} onClose={handleUpdateModalClose}>
        <UpdateExternalProfileModal />
      </Modal>
      <Modal open={deleteModalOpen} onClose={handleDeleteModalClose}>
        <DeleteExternalProfileModal />
      </Modal>
    </Grid>
  )
}
