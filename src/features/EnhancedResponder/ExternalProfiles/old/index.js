import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { DataTable } from 'ambient_ui'
import clsx from 'clsx'

import {
  fetchContactsRequested,
  createContactRequested,
  deleteContactRequested,
} from '../externalContactsSlice'
import tableDataSelector from '../../../../selectors/externalContacts/tableData'

import makeStyles from './styles'

export default function ExternalProfiles() {
  const dispatch = useDispatch()
  const { account } = useParams()

  const tableData = useSelector(tableDataSelector)
  const contactsLoading = useSelector(
    state => state.externalContacts.contactsLoading,
  )
  const darkMode = useSelector(state => state.settings.darkMode)

  const classes = makeStyles({ darkMode })

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

  useEffect(() => {
    dispatch(fetchContactsRequested({ accountSlug: account }))
  }, [account, dispatch])

  const table = (
    <DataTable
      title=''
      editable={{
        onRowAdd: newData => {
          return new Promise((resolve, reject) => {
            dispatch(
              createContactRequested({
                accountSlug: account,
                ...newData,
              }),
            )
            resolve()
          })
        },
        onRowDelete: oldData => {
          return new Promise((resolve, reject) => {
            dispatch(
              deleteContactRequested({
                id: oldData.id,
              }),
            )
            resolve()
          })
        },
      }}
      data={tableData}
      columns={tableColumns}
      options={{
        ...tableOptions,
      }}
    />
  )

  const content = contactsLoading ? <LinearProgress /> : table

  return (
    <Grid container>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <h3 className={clsx('am-h4', classes.title, classes.textColor)}>
          External Contacts
        </h3>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {content}
      </Grid>
    </Grid>
  )
}
