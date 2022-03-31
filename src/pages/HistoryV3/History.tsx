/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Paper } from '@material-ui/core'
import PageTitle from 'components/Page/Title'
import {
  fetchSitesRequested,
  fetchAlertEventsRequested,
  AlertHistorySliceProps,
} from 'pages/HistoryV3/alertHistorySlice'

import AlertsContainer from './components/AlertsContainer'

export default function AlertsHistory(): JSX.Element {
  const dispatch = useDispatch()
  const { account }: { account: string } = useParams()

  const page = useSelector(
    (state: AlertHistorySliceProps) => state.alertHistoryV3.page,
  )
  const alertEvents = useSelector(
    (state: AlertHistorySliceProps) => state.alertHistoryV3.alertEvents,
  )

  useEffect(() => {
    dispatch(
      fetchAlertEventsRequested({
        accountSlug: account,
        page,
      }),
    )
  }, [dispatch, account, page])

  useEffect(() => {
    dispatch(fetchSitesRequested({ accountSlug: account }))
  }, [dispatch, account])

  return (
    <>
      <PageTitle title='Alerts' />
      <Paper>
        <AlertsContainer alertEvents={alertEvents} />
      </Paper>
    </>
  )
}
