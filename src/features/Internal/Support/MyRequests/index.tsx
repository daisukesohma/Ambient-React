/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import map from 'lodash/map'
// src
import { Box, Grid, Modal } from '@material-ui/core'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
import { Can } from 'rbac'

import {
  fetchUserSupportRequestsRequested,
  closeModal,
  openModal,
  setCurrentPage,
  setNewLimit,
  setAccountFilter,
  fetchAccountsRequested,
  // setSort,
} from '../../redux/internalSlice'
import RequestTableContainer from '../components/RequestTableContainer'
import RequestSupportAccessModal from '../components/RequestSupportAccessModal'
import RenderStartRequested from '../components/RenderStartRequested'
import RenderEndRequested from '../components/RenderEndRequested'
import RenderStatus from '../components/RenderStatus'
import RenderDefaultCell from '../components/RenderDefaultCell'

import { useStyles } from './styles'

const columns = [
  {
    title: 'Account',
    field: 'account',
    render: RenderDefaultCell('account'),
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

export default function MySupportRequests(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const supportRequests = useSelector(
    (state: any) => state.internal.supportRequests,
  )
  const accounts = useSelector((state: any) => state.internal.accounts)

  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  // eslint-disable-next-line
  const classes = useStyles({ darkMode })
  const onSearch = (query: string | null) => {
    setSearchQuery(query)
  }
  const setPage = (page: number) => {
    dispatch(setCurrentPage({ page: page + 1 }))
  }
  const setLimit = (limit: number) => {
    dispatch(setNewLimit({ limit }))
  }
  const setAccount = (selectedAccount: string) => {
    dispatch(setAccountFilter({ accountFilter: selectedAccount }))
  }
  // TODO:
  const onSort = () => {}
  const pages = useSelector((state: any) => state.internal.supportRequestPages)
  const limit = useSelector((state: any) => state.internal.supportRequestLimit)
  const totalCount = useSelector(
    (state: any) => state.internal.supportRequestTotalCount,
  )
  const currentPage = useSelector(
    (state: any) => state.internal.supportRequestCurrentPage - 1,
  )
  const loading = useSelector(
    (state: any) => state.internal.loadingSupportRequests,
  )
  const accountFilter = useSelector(
    (state: any) => state.internal.accountFilter,
  )
  const refresh = useSelector((state: any) => state.internal.refresh)
  const modalOpened = useSelector((state: any) => state.internal.modalOpened)

  const processedSupportRequests = map(supportRequests, request => {
    return {
      id: request.id,
      actions: request.allowedActions,
      account: request.account.slug,
      reason: request.reason,
      tsEndActive: request.tsEndActive,
      tsEndRequested: request.tsEndRequested,
      tsStartActive: request.tsStartActive,
      tsStartRequested: request.tsStartRequested,
      status: request.status,
      isActive: request.isActive,
      isExpired: request.isExpired,
    }
  })

  const processedAccounts = [
    {
      label: 'All Accounts',
      value: null,
    },
    ...map(accounts, a => ({
      label: a.slug,
      value: a.slug,
    })),
  ]

  const additionalTools = (
    <div className={classes.additionalTools}>
      <div className={classes.filterTitle}>Filter by Account</div>
      <div className={classes.filterDropdown}>
        <SearchableSelectDropdown
          options={processedAccounts}
          onChange={(account: any) => setAccount(account.value)}
          value={processedAccounts.find((a: any) => a.value === accountFilter)!}
        />
      </div>
    </div>
  )

  useEffect(() => {
    dispatch(fetchAccountsRequested({}))
  }, [dispatch])

  // current page is + 1 due to zero indexing on backend, but not on DataTable
  // need a better way to refresh
  useEffect(() => {
    dispatch(
      fetchUserSupportRequestsRequested({
        filters: {
          searchQuery,
          accountSlug: accountFilter,
        },
        orderDesc: true,
        page: currentPage + 1,
        limit,
      }),
    )
  }, [dispatch, currentPage, limit, refresh, searchQuery, accountFilter])

  return (
    <Grid
      container
      spacing={4}
      className={classes.root}
      alignItems='flex-start'
      direction='row'
      justify='space-evenly'
    >
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <div className='am-h4'>My Support Requests</div>
          </Box>
          <Box>
            <Can I='request' on='SupportAccess'>
              <Button
                color='primary'
                variant='contained'
                customStyle={{ marginLeft: 8 }}
                onClick={() => {
                  dispatch(openModal())
                }}
              >
                Request Access
              </Button>
            </Can>
          </Box>
        </Box>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <RequestTableContainer
          additionalTools={additionalTools}
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
      <Modal
        onClose={() => {
          dispatch(closeModal())
        }}
        open={modalOpened}
      >
        <RequestSupportAccessModal />
      </Modal>
    </Grid>
  )
}
