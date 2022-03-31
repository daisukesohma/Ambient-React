/* eslint-disable @typescript-eslint/ban-ts-comment  */

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
// src
import UserAvatar from 'components/UserAvatar'

import {
  fetchUserLoginActivityRequested,
  setCurrentPage,
  setNewLimit,
  setSort,
} from './redux/userLoginAuditLogSlice'
import useStyles from './styles'
import UserLoginAuditLogTableContainer from './components/UserLoginAuditLogTableContainer'

interface LoginData {
  id: string
  status: string
  ts: number
  type: string
  description: string
  userLoginSessionEnded: []
  userLoginSessionStated: []
}

export default function UserLoginAuditLog(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const user = useSelector((state: any) => state.userLoginAuditLog.user)
  const loginData = useSelector(
    (state: any) => state.userLoginAuditLog.userLoginActivity,
  )
  const pages = useSelector(
    (state: any) => state.userLoginAuditLog.userLoginActivityPages,
  )
  const totalCount = useSelector(
    (state: any) => state.userLoginAuditLog.userLoginActivityTotalCount,
  )
  const currentPage = useSelector(
    (state: any) => state.userLoginAuditLog.userLoginActivityCurrentPage,
  )
  const limit = useSelector(
    (state: any) => state.userLoginAuditLog.userLoginActivityLimit,
  )
  const loading = useSelector(
    (state: any) => state.userLoginAuditLog.loadingLoginActivity,
  )
  const sortOrder = useSelector(
    (state: any) => state.userLoginAuditLog.userLoginActivitySort,
  )
  const [tableData, setTableData] = useState([])
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  const setPage = (page: number) => {
    dispatch(setCurrentPage({ page: page + 1 }))
  }

  const setLimit = (newLimit: number) => {
    dispatch(setNewLimit({ limit: newLimit }))
  }

  const onSort = (sortBy: string, order: number) => {
    dispatch(setSort({ sort: order }))
  }
  const onSearch = (value: string) => {
    if (value === '') {
      setSearchQuery(null)
    } else {
      setSearchQuery(value)
    }
  }
  useEffect(() => {
    dispatch(
      fetchUserLoginActivityRequested({
        profileId: user.profileId,
        startTs: null,
        endTs: null,
        limit,
        page: currentPage,
        desc: sortOrder === 1,
        searchQuery,
      }),
    )
  }, [user, limit, currentPage, dispatch, sortOrder, searchQuery])

  useEffect(() => {
    const data = loginData.map((d: LoginData) => {
      return {
        id: d.id,
        date: d.ts,
        activity: d.type === 'LOGIN' ? 'Login' : 'Logout',
        status: d.status === 'SUCCEEDED' ? 'Succeeded' : 'Failed',
        description: d.description,
      }
    })
    setTableData(data)
  }, [loginData])

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container justify='space-between'>
          <div className={clsx('am-h4')} style={{ margin: '16px 0' }}>
            Login History
          </div>
        </Grid>
        <div className={classes.avatarRow}>
          <UserAvatar
            name={`${user.firstName} ${user.lastName}`}
            img={user.img}
            size={80}
          />
          <div className={clsx(classes.avatarText)}>
            {`${user.firstName} ${user.lastName}`}
          </div>
        </div>
        <UserLoginAuditLogTableContainer
          data={tableData}
          onSearch={onSearch}
          showAddNowButton={false}
          darkMode={darkMode}
          emptyComment='No Login History'
          setPage={setPage}
          setLimit={setLimit}
          pages={pages}
          limit={limit}
          totalCount={totalCount}
          currentPage={currentPage}
          isLoading={loading}
          onSort={onSort}
        />
      </div>
    </div>
  )
}
