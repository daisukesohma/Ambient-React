import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { ErrorPanel, CircularProgress } from 'ambient_ui'
import { isMobile } from 'react-device-detect'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Box } from '@material-ui/core'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import InfoBox from 'components/atoms/InfoBox'
import { InfoBoxTypeEnum } from 'enums/InfoBoxContentEnum'
import { MixPanelEventEnum, SeverityTypeEnum } from 'enums'
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import config from 'config'

import {
  fetchSitesRequested,
  displayAlertEvents,
} from '../../../redux/reports/actions'
import { fetchAccessNodesForAccountRequested } from '../../../redux/slices/accessAlarmDashboard'

import AlertsCarousel from './carousels/AlertsCarousel'
import TotalAlertsComponent from './panels/TotalAlertsComponent/index'
import AcknowledgedAlertsByTimeGauge from './panels/AcknowledgedAlertsByTimeGauge/index'
import DispatchedAlertsByTimeGauge from './panels/DispatchedAlertsByTimeGauge/index'
import DispatchedAlertsGauge from './panels/DispatchedAlertsGauge/index'
import AlertDistributionPieChartComponent from './panels/AlertDistributionPieChartComponent/index'
import AcknowledgementLatencyDistributionChartComponent from './panels/AcknowledgementLatencyDistributionChartComponent/index'
import DispatchLatencyDistributionChartComponent from './panels/DispatchLatencyDistributionChartComponent/index'
import UserActivityDashboardComponent from './charts/UserActivityDashboardComponent/index'
import DispatchedAlertsCarousel from './carousels/DispatchedAlertsCarousel/index'
import ActivityDistributionPieChartComponent from './panels/ActivityDistributionPieChartComponent/index'
import TimeToActionAlertsByTimeGauge from './panels/TimeToActionAlertsByTimeGauge/index'
import TimeToActionDistributionChartComponent from './panels/TimeToActionDistributionChartComponent/index'
import TitleRow from './ReportRow/TitleRow'
import ToolRow from './ReportRow/ToolRow'
import { useStyles } from './styles'

import './style.css'

const MINUTE_IN_SEC = 1000 * 60
const POLL_INTERVAL = MINUTE_IN_SEC * 2

export default function SecurityOpsReport() {
  const [responseData, setResponseData] = useState({
    acknowledgement: null,
    filtered_dispatches: null,
    dispatches: null,
    unresolved_dispatches: null,
  })

  // const [isDownloading, setIsDownloading] = useState(false)
  const loading = useSelector(state => get(state, 'reports.loading', false))
  const error = useSelector(state => get(state, 'reports.error', false))
  const darkMode = useSelector(state => state.settings.darkMode)
  const isDemo = config.settings.demo

  const alertEventsSelectedKey = useSelector(state =>
    get(state, 'reports.alertEventsSelectedKey', null),
  )
  const dispatch = useDispatch()
  const { account } = useParams()
  const classes = useStyles({ isMobile, alertEventsSelectedKey })

  // const [getActivityReport] = useMutation(GET_ACTIVITY_REPORT)
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

  useMixpanel(MixPanelEventEnum.SECURITY_OPERATIONAL_REPORT_ENTER)

  const handlePanelSelection = alertEventsType => {
    if (!isDemo) {
      const type =
        alertEventsType === alertEventsSelectedKey ? null : alertEventsType
      dispatch(displayAlertEvents(type))
    }
  }

  const handleRootClick = event => {
    const elements = document.getElementsByClassName('gauges')

    let insideClicked = false
    for (let i = 0; i < elements.length; i++) {
      insideClicked = insideClicked || elements.item(i).contains(event.target)
    }
  }

  const handleFilteredData = key => response => {
    if (!get(responseData, '[key].alertEvents')) {
      setResponseData({ ...responseData, [key]: response })
    }

    if (
      get(responseData, '[key].alertEvents.length') !==
      get(response, 'alertEvents.length')
    ) {
      setResponseData({ ...responseData, [key]: response })
    }
  }

  //  SAVE For later, when report download matches web report.
  //
  // async function handleGenerateReport() {
  //   setIsDownloading(true)
  //
  //   const res = await getActivityReport({
  //     variables: {
  //       accountSlug,
  //     },
  //   })
  //
  //   const fileLocation = get(
  //     res,
  //     'data.generateSecurityOperationsReport.fileLocation',
  //   )
  //   seeReport(fileLocation)
  //   setIsDownloading(false)
  // }

  const title = 'Security Operations'

  if (loading) {
    return (
      <div style={{ marginTop: '16px' }}>
        <Grid
          container
          direction='row'
          justify='space-evenly'
          alignItems='stretch'
          spacing={2}
        >
          <TitleRow title={title} />
          <Grid className={classes.loadingContainer}>
            <CircularProgress size={40} />
          </Grid>
        </Grid>
      </div>
    )
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  // For Download button
  // const buttonText = isDownloading ? 'Downloading' : 'Download Report'

  /* <Grid item sm={6} xs={12} md={3} lg={3} xl={3}>
    <div
      style={{
        border:
          alertEventsSelectedKey === 'unresolved_dispatches'
            ? `1px solid ${palette.primary.main}`
            : 'none',
      }}
      className={clsx(
        'gauges',
        classes.gaugeGridItem,
        classes.gaugeClickable,
      )}
      onClick={handlePanelSelection('unresolved_dispatches')}
    >
      <UnresolvedDispatchedAlertEventsGauge
        accountSlug={accountSlug}
        pollInterval={POLL_INTERVAL + 175}
        handleFilteredData={handleFilteredData('unresolved_dispatches')}
      />
    </div>
  </Grid> */

  return (
    <Grid container onClick={handleRootClick} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify='space-evenly' spacing={2}>
          <TitleRow title={title} />
          {loading && (
            <Grid className={classes.loadingContainer}>
              <CircularProgress size={40} />
            </Grid>
          )}
          <ToolRow />
        </Grid>
      </Grid>

      <Box mb={2} width={'100%'}>
        <InfoBox type={InfoBoxTypeEnum.TIMEZONE_SUPPORT} />
      </Box>

      <Grid item xs={12}>
        <Grid container direction='row' spacing={2}>
          <Grid item sm={6} xs={12} md={2} lg={2} xl={2}>
            <TotalAlertsComponent
              pollInterval={POLL_INTERVAL + 25}
              isTest={false}
              severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={3} lg={3} xl={3}>
            <Box
              className={clsx(classes.maxHeight, classes.gaugeClickable, {
                [classes.selected]:
                  alertEventsSelectedKey === 'acknowledgement',
                [classes.border]: !darkMode,
              })}
              onClick={() => handlePanelSelection('acknowledgement')}
            >
              <AcknowledgedAlertsByTimeGauge
                pollInterval={POLL_INTERVAL + 50}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={2} lg={2} xl={2}>
            <Box className={clsx(classes.border, classes.maxHeight)}>
              <AcknowledgementLatencyDistributionChartComponent
                pollInterval={POLL_INTERVAL + 150}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={3} lg={3} xl={3}>
            <Box
              className={clsx(classes.maxHeight, classes.gaugeClickable, {
                [classes.selected]: alertEventsSelectedKey === 'time_to_act',
                [classes.border]: !darkMode,
              })}
              onClick={() => handlePanelSelection('time_to_act')}
            >
              <TimeToActionAlertsByTimeGauge
                pollInterval={POLL_INTERVAL + 50}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={2} lg={2} xl={2}>
            <Box className={clsx(classes.border, classes.maxHeight)}>
              <TimeToActionDistributionChartComponent
                pollInterval={POLL_INTERVAL + 150}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {alertEventsSelectedKey && (
        <Grid item xs={12}>
          <Grid container direction='row'>
            <AlertsCarousel />
          </Grid>
        </Grid>
      )}

      <Grid item xs={12}>
        <Grid container direction='row' spacing={2}>
          <Grid item sm={6} xs={12} md={2} lg={2} xl={2}>
            <Box
              className={clsx(
                classes.border,
                classes.maxHeight,
                classes.gaugeClickable,
                {
                  [classes.selected]: alertEventsSelectedKey === 'dispatches',
                },
              )}
              onClick={() => handlePanelSelection('dispatches')}
            >
              <DispatchedAlertsGauge
                pollInterval={POLL_INTERVAL + 100}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={3} lg={3} xl={3}>
            <Box
              className={clsx(
                classes.border,
                classes.maxHeight,
                classes.gaugeClickable,
                {
                  [classes.selected]:
                    alertEventsSelectedKey === 'filtered_dispatches',
                },
              )}
              onClick={() => handlePanelSelection('filtered_dispatches')}
            >
              <DispatchedAlertsByTimeGauge
                pollInterval={POLL_INTERVAL + 75}
                handleFilteredData={handleFilteredData('filtered_dispatches')}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={3} lg={3} xl={3}>
            <Box className={clsx(classes.border, classes.maxHeight)}>
              <DispatchLatencyDistributionChartComponent
                pollInterval={POLL_INTERVAL + 175}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={2} lg={2} xl={2}>
            <Box className={clsx(classes.border, classes.maxHeight)}>
              <AlertDistributionPieChartComponent
                pollInterval={POLL_INTERVAL + 125}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={2} lg={2} xl={2}>
            <Box className={clsx(classes.border, classes.maxHeight)}>
              <ActivityDistributionPieChartComponent
                pollInterval={POLL_INTERVAL + 125}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_2]}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container direction='row' spacing={2}>
          <Grid sm={12} xs={12} md={12} lg={12} xl={12}>
            <UserActivityDashboardComponent
              pollInterval={POLL_INTERVAL + 200}
              isTest={false}
              severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container direction='row' spacing={2}>
          <Grid
            item
            sm={12}
            xs={12}
            md={12}
            lg={12}
            xl={12}
            style={{ width: '100%' }}
          >
            {!isDemo && (
              <DispatchedAlertsCarousel
                pollInterval={POLL_INTERVAL + 225}
                isTest={false}
                severities={[SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1]}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
