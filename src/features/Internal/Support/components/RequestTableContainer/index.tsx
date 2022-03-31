import React from 'react'
import { useDispatch } from 'react-redux'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { x } from 'react-icons-kit/feather/x'
import { useTheme } from '@material-ui/core/styles'
import Check from 'ambient_ui/components/icons/contents/Check'
import Icon from 'react-icons-kit'
// src
import DataTable from 'components/organisms/DataTable'

import {
  grantSupportAccessRequested,
  denySupportAccessRequested,
  withdrawSupportAccessRequested,
  revokeSupportAccessRequested,
  releaseSupportAccessRequested,
} from '../../../redux/internalSlice'
import { RowData, RequestTableContainerProps } from '../interfaces'

export default function RequestTableContainer({
  data = [],
  darkMode,
  showAddNowButton,
  isLoading,
  emptyComment,
  setPage,
  setLimit,
  pages,
  limit = 10,
  totalCount = 0,
  currentPage = 1,
  onSort,
  onSearch,
  columns,
  additionalTools,
}: RequestTableContainerProps): JSX.Element {
  const { palette } = useTheme()
  const dispatch = useDispatch()

  const renderX = () => (
    <div style={{ color: palette.error.main, cursor: 'pointer' }}>
      <Icon size={24} icon={x} />
    </div>
  )

  const renderCheck = () => (
    <div style={{ cursor: 'pointer' }}>
      <Check stroke={palette.primary.main} width={24} height={24} />
    </div>
  )

  const actions = [
    {
      validation: (rowData: RowData) =>
        !isEmpty(
          filter(
            get(rowData, 'actions', []),
            action => action.key === 'granted',
          ),
        ) && !get(rowData, 'isExpired', false),
      icon: renderCheck,
      tooltip: 'Approve',
      onClick: (e: any, rowData: RowData) => {
        dispatch(
          grantSupportAccessRequested({
            input: { requestId: rowData.id },
          }),
        )
      },
    },
    {
      validation: (rowData: RowData) =>
        !isEmpty(
          filter(
            get(rowData, 'actions', []),
            action => action.key === 'denied',
          ),
        ) && !get(rowData, 'isExpired', false),
      icon: renderX,
      tooltip: 'Deny',
      onClick: (e: any, rowData: RowData) => {
        dispatch(
          denySupportAccessRequested({
            input: { requestId: rowData.id },
          }),
        )
      },
    },
    {
      validation: (rowData: RowData) =>
        !isEmpty(
          filter(
            get(rowData, 'actions', []),
            action => action.key === 'withdrawn',
          ),
        ) && !get(rowData, 'isExpired', false),
      icon: renderX,
      tooltip: 'Withdraw',
      onClick: (e: any, rowData: RowData) => {
        dispatch(
          withdrawSupportAccessRequested({
            input: { requestId: rowData.id },
          }),
        )
      },
    },
    {
      validation: (rowData: RowData) =>
        !isEmpty(
          filter(
            get(rowData, 'actions', []),
            action => action.key === 'revoked',
          ),
        ) && !get(rowData, 'isExpired', false),
      icon: renderX,
      tooltip: 'Revoke',
      onClick: (e: any, rowData: RowData) => {
        dispatch(
          revokeSupportAccessRequested({
            input: { requestId: rowData.id },
          }),
        )
      },
    },
    {
      validation: (rowData: RowData) =>
        !isEmpty(
          filter(
            get(rowData, 'actions', []),
            action => action.key === 'released',
          ),
        ) && !get(rowData, 'isExpired', false),
      icon: renderCheck,
      tooltip: 'Release',
      onClick: (e: any, rowData: RowData) => {
        dispatch(
          releaseSupportAccessRequested({
            input: { requestId: rowData.id },
          }),
        )
      },
    },
  ]

  return (
    <DataTable
      additionalTools={additionalTools || undefined}
      actions={actions}
      isSearchable
      onSearch={onSearch}
      emptyComment={emptyComment}
      darkMode={darkMode}
      serverSideProcessing
      page={currentPage}
      pages={pages}
      setPage={setPage}
      rowsPerPage={limit}
      setRowsPerPage={setLimit}
      columns={columns}
      data={data}
      isPaginated
      defaultRowsPerPage={limit}
      isLoading={isLoading}
      showAddNowButton={showAddNowButton}
      totalCountOverride={totalCount}
      defaultOrder='desc'
      onSort={onSort}
    />
  )
}
