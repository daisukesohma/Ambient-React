import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import { Grid } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import {
  fetchAccessAlarmTypeDistributionRequested,
  fetchDoorPACSAlertEventDistributionRequested,
  fetchInvalidBadgePACSAlertEventDistributionRequested,
} from 'redux/slices/accessAlarmDashboard'
import { AccessAlarmTypeEnum } from 'enums'
import DataTable from 'components/organisms/DataTable'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import LoadingScreen from 'containers/LoadingScreen'
import clsx from 'clsx'

import StackBar from './components/StackBar'
import ReaderList from './components/ReaderList'
import useStyles from './styles'
import useStackBarData from './hooks/useStackBarData'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import config from 'config'

const isDemo = config.settings.demo

const breakdownTableColumns = [
  { title: 'Type', field: 'name' },
  { title: 'Volume', field: 'value' },
  { title: '% Contextualized by Ambient', field: 'totalPercent' },
]
const DEFAULT_BREAKDOWN_COUNT = 10

const AccessAlarmDashboard = () => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state =>
    get(state, 'accessAlarmDashboard.startTs', null),
  )
  const endTs = useSelector(state =>
    get(state, 'accessAlarmDashboard.endTs', null),
  )

  const doorPacsAlertEventDistribution = useSelector(state =>
    get(state, `accessAlarmDashboard.doorPacsAlertEventDistribution`, []),
  )

  const invalidBadgePacsAlertEventDistribution = useSelector(state =>
    get(
      state,
      `accessAlarmDashboard.invalidBadgePacsAlertEventDistribution`,
      [],
    ),
  )

  const accessAlarmTypeDistributions = useSelector(state =>
    get(state, 'accessAlarmDashboard.accessAlarmTypeDistributions', []),
  )

  const loadingDoorPACSDistribution = useSelector(state =>
    get(state, `accessAlarmDashboard.loadingDoorPACSDistribution`, false),
  )

  const loadingInvalidBadgePACSDistribution = useSelector(state =>
    get(
      state,
      'accessAlarmDashboard.loadingInvalidBadgePACSDistribution',
      false,
    ),
  )

  const loadingTypeDistribution = useSelector(state =>
    get(state, 'accessAlarmDashboard.loadingTypeDistribution', false),
  )

  const _DHOData = accessAlarmTypeDistributions.find(
    i => i.name === AccessAlarmTypeEnum.DOOR_HELD_OPEN,
  )
  const _DFOData = accessAlarmTypeDistributions.find(
    i => i.name === AccessAlarmTypeEnum.DOOR_FORCED_OPEN,
  )
  const _InvalidBadgeData = accessAlarmTypeDistributions.find(
    i => i.name === AccessAlarmTypeEnum.INVALID_BADGE,
  )

  const filteredTypeDistributions = useMemo(
    () =>
      accessAlarmTypeDistributions.filter(d => {
        return ![
          AccessAlarmTypeEnum.GRANTED_ACCESS,
          AccessAlarmTypeEnum.GRANTED_NO_ENTRY,
          AccessAlarmTypeEnum.DOOR_RESTORED,
          AccessAlarmTypeEnum.ACTIVE_ALARM,
          AccessAlarmTypeEnum.TECHNICAL_NOTIFICATION,
        ].includes(d.name)
      }),
    [accessAlarmTypeDistributions],
  )

  const pieDataTotalValue = useMemo(
    () =>
      filteredTypeDistributions.reduce(
        (sum, current) => sum + current.value,
        0,
      ),
    [filteredTypeDistributions],
  )

  const pieData = (filteredTypeDistributions || []).map(d => ({
    ...d,
    totalPercent: d.value
      ? ((d.ambientCount / d.value) * 100).toFixed(2)
      : 'N/A',
  }))

  useEffect(() => {
    if (isDemo) {
      return
    }
    dispatch(
      fetchAccessAlarmTypeDistributionRequested({
        accountSlug: account,
        siteSlugs: globalSelectedSite ? [globalSelectedSite] : undefined,
        startTs,
        endTs,
      }),
    )
    dispatch(
      fetchDoorPACSAlertEventDistributionRequested({
        accountSlug: account,
        siteSlugs: globalSelectedSite ? [globalSelectedSite] : undefined,
        startTs,
        endTs,
        accessAlarmTypes: [
          AccessAlarmTypeEnum.DOOR_FORCED_OPEN,
          AccessAlarmTypeEnum.DOOR_HELD_OPEN,
        ],
      }),
    )
    dispatch(
      fetchInvalidBadgePACSAlertEventDistributionRequested({
        accountSlug: account,
        siteSlugs: globalSelectedSite ? [globalSelectedSite] : undefined,
        startTs,
        endTs,
        accessAlarmTypes: [AccessAlarmTypeEnum.INVALID_BADGE],
      }),
    )
  }, [account, globalSelectedSite, startTs, endTs, dispatch])

  // get stack bar data for door alarms
  const {
    originalData: doorOriginalData,
    ambientData: doorAmbientData,
    originalTotal: doorOriginalTotal,
    ambientTotal: doorAmbientTotal,
  } = useStackBarData({
    originalDistribution: _DFOData && _DHOData ? [_DFOData, _DHOData] : [],
    ambientDistribution: doorPacsAlertEventDistribution,
  })
  // get stack bar data for invalid badges
  const {
    originalData: invalidBadgeOriginalData,
    ambientData: invalidBadgeAmbientData,
    originalTotal: invalidBadgeOriginalTotal,
    ambientTotal: invalidBadgeAmbientTotal,
  } = useStackBarData({
    originalDistribution: _InvalidBadgeData ? [_InvalidBadgeData] : [],
    ambientDistribution: invalidBadgePacsAlertEventDistribution,
  })

  const originalTotal = doorOriginalTotal + invalidBadgeOriginalTotal
  const reducedPercent = originalTotal
    ? (100 * (originalTotal - doorAmbientTotal - invalidBadgeAmbientTotal)) /
      originalTotal
    : 'N/A'

  if (
    loadingDoorPACSDistribution ||
    loadingInvalidBadgePACSDistribution ||
    loadingTypeDistribution
  ) {
    return <LoadingScreen />
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <div className={clsx(classes.piechart, classes.paper)}>
            <div className={classes.stackedHeader}>
              <div
                className={`am-h5 ${classes.label}`}
                style={{
                  marginTop: '8px',
                }}
              >
                Total Access Alarm Breakdown
              </div>
              <div className={classes.alert}>
                <Alert
                  severity='info'
                  icon={false}
                  classes={{ root: classes.alertRoot }}
                >
                  <div className='am-h5'>
                    Total Volume:
                    {pieDataTotalValue}
                  </div>
                </Alert>
              </div>
            </div>
            <div className={classes.tables}>
              <DataTable
                darkMode={darkMode}
                isDownloadable
                downloadableData={pieData}
                downloadableFileName='breakdown.csv'
                columns={breakdownTableColumns}
                data={pieData}
                defaultRowsPerPage={DEFAULT_BREAKDOWN_COUNT}
                // isPaginated={false}
                isCountVisible={false}
                showAddNowButton={false}
                defaultOrder='desc'
                defaultOrderBy='value'
                // The accessAlarmTypeDistribution API returns { name: ..., value: } array so we should use 'value' field to sort
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <div className={clsx(classes.stackedBar, classes.paper)}>
            <div className={classes.stackedHeader}>
              <div
                className={`am-h5 ${classes.label}`}
                style={{
                  marginTop: '8px',
                }}
              >
                Total Access Alarm Reduction
              </div>
              <div className={classes.alert}>
                <Alert severity='info' classes={{ root: classes.alertRoot }}>
                  <Tooltip
                    content={
                      <TooltipText text='Difference in Alert Volume from Total Alerts Raised by Ambient vs Total Alerts raised by PACS Readers Connected to Ambient' />
                    }
                    placement='bottom'
                  >
                    <div className='am-h5'>
                      Reduction:{' '}
                      {reducedPercent !== 'N/A'
                        ? `${reducedPercent.toFixed(1)}%`
                        : reducedPercent}
                    </div>
                  </Tooltip>
                </Alert>
              </div>
            </div>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className={classes.stackedBarRoot}
              >
                <div className='am-h6'>Door Alarms</div>
                <div className={classes.alertSmall}>
                  <Alert severity='info' classes={{ root: classes.alertRoot }}>
                    <Tooltip
                      content={
                        <TooltipText text='Difference between PACS alarms vs ambient alerts' />
                      }
                      placement='bottom'
                    >
                      Reduction:{' '}
                      {doorOriginalTotal
                        ? `${(
                            ((doorOriginalTotal - doorAmbientTotal) /
                              doorOriginalTotal) *
                            100
                          ).toFixed(2)}%`
                        : 'N/A'}
                    </Tooltip>
                  </Alert>
                </div>
                <StackBar
                  darkMode={darkMode}
                  data={[doorOriginalData, doorAmbientData]}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                className={classes.stackedBarRoot}
              >
                <div className='am-h6'>Invalid Badges</div>
                <div className={classes.alertSmall}>
                  <Alert severity='info' classes={{ root: classes.alertRoot }}>
                    <Tooltip
                      content={
                        <TooltipText text='Difference between PACS alarms vs ambient alerts' />
                      }
                      placement='bottom'
                    >
                      Reduction:{' '}
                      {invalidBadgeOriginalTotal
                        ? `${(
                            ((invalidBadgeOriginalTotal -
                              invalidBadgeAmbientTotal) /
                              invalidBadgeOriginalTotal) *
                            100
                          ).toFixed(2)}%`
                        : 'N/A'}
                    </Tooltip>
                  </Alert>
                </div>
                <StackBar
                  darkMode={darkMode}
                  data={[invalidBadgeOriginalData, invalidBadgeAmbientData]}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <ReaderList accessAlarmType={AccessAlarmTypeEnum.DOOR_HELD_OPEN} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <ReaderList accessAlarmType={AccessAlarmTypeEnum.DOOR_FORCED_OPEN} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <ReaderList
            accessAlarmType={AccessAlarmTypeEnum.COMMUNICATION_FAILURE}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <ReaderList accessAlarmType={AccessAlarmTypeEnum.OPEN_LOOP} />
        </Grid>
      </Grid>
    </div>
  )
}

export default AccessAlarmDashboard
