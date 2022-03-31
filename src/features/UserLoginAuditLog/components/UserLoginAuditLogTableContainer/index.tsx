import React from 'react'
// src
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'
import DataTable from 'components/organisms/DataTable'

interface Props {
  data: {
    date: string
    activity: string
    status: string
    description: string
  }[]
  darkMode: boolean
  showAddNowButton: boolean
  emptyComment: string
  isLoading: boolean
  setPage(page: number): void
  setLimit(newLimit: number): void
  pages: number
  limit: number
  totalCount: number
  currentPage: number
  onSort(sortBy: string, sortOrder: number): void
  onSearch(value: string): void
}

interface RowData {
  id: string
  date: number
  activity: string
  status: string
  description: string
}

const renderDate = (rowData: RowData) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'fit-content',
        alignItems: 'center',
      }}
    >
      <span className='am-subtitle1'>
        {formatUnixTimeWithTZ(rowData.date, 'yyy-MM-dd HH:mm:ss zzz')}
      </span>
    </div>
  )
}

const columns = [
  {
    title: 'Date',
    field: 'date',
    render: renderDate,
    sorting: true,
    sortBy: 'date',
  },
  {
    title: 'Activity',
    field: 'activity',
    sorting: false,
  },
  {
    title: 'Status',
    field: 'status',
    sorting: false,
  },
  {
    title: 'Description',
    field: 'description',
    sorting: false,
  },
]

export default function UserLoginAuditLogTableContainer({
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
}: Props): JSX.Element {
  return (
    <DataTable
      // additionalTools={additionalTools}
      isSearchable
      onSearch={onSearch}
      emptyComment={emptyComment}
      darkMode={darkMode}
      serverSideProcessing
      page={currentPage - 1}
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
