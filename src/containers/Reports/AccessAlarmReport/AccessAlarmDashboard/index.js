import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import { Alert } from '@material-ui/lab'
import InfoBox from 'components/atoms/InfoBox'
import { InfoBoxTypeEnum } from 'enums/InfoBoxContentEnum'
import { fetchSitesRequested } from 'redux/reports/actions'
import { fetchAccessNodesForAccountRequested } from 'redux/slices/accessAlarmDashboard'
import config from 'config'

import TitleRow from './ReportRow/TitleRow'
import ToolRow from './ReportRow/ToolRow'
import Dashboard from './Dashboard'

const AccessAlarm = () => {
  const accessNodesForAccount = useSelector(state =>
    get(state, 'accessAlarmDashboard.accessNodesForAccount', []),
  )

  const dispatch = useDispatch()
  const { account } = useParams()
  const isDemo = config.settings.demo

  useEffect(() => {
    dispatch(
      fetchSitesRequested({
        accountSlug: account,
      }),
    )
    dispatch(
      fetchAccessNodesForAccountRequested({
        accountSlug: account,
      }),
    )
  }, [account, dispatch])

  const title = 'PACS Alarms'

  return (
    <div style={{ marginTop: '16px' }}>
      <Grid container justify='space-evenly' spacing={2}>
        <TitleRow title={title} />
        <ToolRow />
      </Grid>
      <InfoBox type={InfoBoxTypeEnum.TIMEZONE_SUPPORT} />

      <Grid container direction='row' spacing={2} style={{ marginTop: 16 }}>
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          xl={12}
          className='access-alarm'
        >
          {accessNodesForAccount && accessNodesForAccount.length ? (
            <Dashboard demo={isDemo} />
          ) : (
            <Alert severity='info'>
              Your account does not have Physical Access Control System (PACS)
              integration with Ambient set up. Please contact your Ambient.ai
              Account Representative to learn more.
            </Alert>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default AccessAlarm
