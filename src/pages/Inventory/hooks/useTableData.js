import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
// src
import TableCell from 'components/Table/Cell'

import {
  ActionsField,
  CommentsField,
  DestinationField,
  NameField,
  SerialNumberField,
  HardwareField,
  StatusField,
  TrackingField,
} from '../components/Fields'

import {
  fetchInventoryRequested,
  collectionSetLimit,
  collectionSetPage,
  collectionSetSearchQuery,
  setProvisionStatus,
} from '../redux'

const useTableData = () => {
  const reduxSlice = 'inventory'
  const collectionName = 'collection'
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.loading)
  const totalCountOverride = useSelector(state =>
    get(state, `${reduxSlice}.${collectionName}Count`),
  )
  const page = useSelector(state =>
    get(state, `${reduxSlice}.${collectionName}CurrentPage`),
  )
  const limit = useSelector(state =>
    get(state, `${reduxSlice}.${collectionName}Limit`),
  )
  const pages = useSelector(state =>
    get(state, `${reduxSlice}.${collectionName}Pages`),
  )
  const searchQuery = useSelector(state =>
    get(state, `${reduxSlice}.${collectionName}Query`),
  )
  const selectedProvisionStatus = useSelector(state =>
    get(state, `${reduxSlice}.selectedProvisionStatus`),
  )

  const darkMode = useSelector(state => state.settings.darkMode)
  const setPage = newPage => dispatch(collectionSetPage({ page: newPage + 1 }))
  const setLimit = newLimit => dispatch(collectionSetLimit({ limit: newLimit }))
  const setSearchQuery = newQuery =>
    dispatch(collectionSetSearchQuery({ query: newQuery }))
  const setNodeProvisionStatus = newStatus =>
    dispatch(setProvisionStatus({ status: newStatus }))

  useEffect(() => {
    dispatch(
      fetchInventoryRequested({
        filters: {
          searchQuery,
          nodeProvisionStatus: selectedProvisionStatus.id,
        },
        page,
        limit,
      }),
    )
  }, [page, limit, searchQuery, selectedProvisionStatus, dispatch])

  const columns = [
    {
      title: 'Status',
      render: row => <StatusField rowData={row} darkMode={darkMode} />,
      sorting: false,
    },
    {
      title: 'Node',
      render: row => <NameField rowData={row} darkMode={darkMode} />,
      sorting: false,
    },
    {
      title: 'SKU',
      render: row => <HardwareField rowData={row} darkMode={darkMode} />,
      sorting: false,
    },
    {
      title: 'Serial Number',
      render: row => <SerialNumberField rowData={row} darkMode={darkMode} />,
      sorting: false,
    },
    {
      title: 'Provision Id',
      render: row => <TableCell>{row.node.provisioningKey}</TableCell>,
      sorting: false,
    },
    {
      title: 'Destination',
      render: row => <DestinationField rowData={row} darkMode={darkMode} />,
      sorting: false,
    },
    {
      title: 'Comments',
      render: row => <CommentsField rowData={row} darkMode={darkMode} />,
      sorting: false,
    },
  ]

  return {
    columns,
    limit,
    isLoading,
    setLimit,
    setPage,
    searchQuery,
    setSearchQuery,
    page,
    pages,
    totalCountOverride,
    setNodeProvisionStatus,
    selectedProvisionStatus,
  }
}

export default useTableData
