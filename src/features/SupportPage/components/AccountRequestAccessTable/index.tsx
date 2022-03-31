import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import map from 'lodash/map'
// src
import { Grid } from '@material-ui/core'
import Name from 'features/Internal/Support/components/Name'
import RequestTableContainer from 'features/Internal/Support/components/RequestTableContainer'
import {
  fetchAccountSupportRequestsRequested,
  setCurrentPage,
  setNewLimit,
} from 'features/Internal/redux/internalSlice'
import RenderStartRequested from 'features/Internal/Support/components/RenderStartRequested'
import RenderEndRequested from 'features/Internal/Support/components/RenderEndRequested'
import RenderStatus from 'features/Internal/Support/components/RenderStatus'
import RenderDefaultCell from 'features/Internal/Support/components/RenderDefaultCell'

import useStyles from './styles'

const columns = [
  {
    title: 'Name',
    field: 'name',
    render: Name,
    sorting: false,
  },
  {
    title: 'Reason',
    field: 'reason',
    render: RenderDefaultCell('reason'),
    sorting: false,
  },
  {
    title: 'Start Requested',
    field: 'tsStartRequested',
    render: RenderStartRequested,
    sorting: false,
    sortBy: 'tsStartRequested',
  },
  {
    title: 'End Requested',
    field: 'tsEndRequested',
    render: RenderEndRequested,
    sorting: false,
    sortBy: 'tsEndRequested',
  },
  {
    title: 'Status',
    field: 'status',
    render: RenderStatus,
    sorting: false,
  },
]

export default function AccountRequestAccessTable(): JSX.Element {
  const dispatch = useDispatch()
  const { account } = useParams<{ account: string }>()
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const supportRequests = useSelector(
    (state: any) => state.internal.supportRequests,
  )
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  // TODO:
  const onSort = () => {}
  // eslint-disable-next-line
  const onSearch = (query: string | null) => {
    setSearchQuery(query)
  }

  const pages = useSelector((state: any) => state.internal.supportRequestPages)
  const limit = useSelector((state: any) => state.internal.supportRequestLimit)
  const totalCount = useSelector(
    (state: any) => state.internal.supportRequestTotalCount,
  )
  const currentPage = useSelector(
    (state: any) => state.internal.supportRequestCurrentPage,
  )
  const loading = useSelector(
    (state: any) => state.internal.loadingSupportRequests,
  )
  const refresh = useSelector((state: any) => state.internal.refresh)

  const setPage = (page: number) => {
    dispatch(setCurrentPage({ page }))
  }
  const setLimit = (newLimit: number) => {
    dispatch(setNewLimit({ newLimit }))
  }

  const processedSupportRequests = map(supportRequests, request => {
    return {
      id: request.id,
      actions: request.allowedActions,
      reason: request.reason,
      tsEndActive: request.tsEndActive,
      tsEndRequested: request.tsEndRequested,
      tsStartActive: request.tsStartActive,
      tsStartRequested: request.tsStartRequested,
      name: `${get(request, 'user.firstName', '')} ${get(
        request,
        'user.lastName',
        '',
      )}`,
      img: `${get(request, 'user.profile.img', '')}`,
      status: request.status,
      isActive: request.isActive,
      isExpired: request.isExpired,
    }
  })

  // current page is + 1 due to zero indexing on backend, but not on DataTable
  // need a better way to refresh
  useEffect(() => {
    dispatch(
      fetchAccountSupportRequestsRequested({
        accountSlug: account,
        filters: {
          searchQuery,
        },
        orderDesc: true,
        page: currentPage + 1,
        limit,
      }),
    )
  }, [dispatch, currentPage, limit, refresh, account, searchQuery])

  return (
    <Grid item lg={12} md={12} sm={12} xs={12} className={classes.root}>
      <div className='am-h5'>Support Access Audit Log</div>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <RequestTableContainer
          // additionalTools={additionalTools}
          onSearch={onSearch}
          emptyComment='No Support Requests'
          darkMode={darkMode}
          pages={pages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          columns={columns}
          data={processedSupportRequests}
          isLoading={loading}
          showAddNowButton={false}
          currentPage={currentPage}
          totalCount={totalCount}
          onSort={onSort}
        />
      </Grid>
    </Grid>
  )
}
