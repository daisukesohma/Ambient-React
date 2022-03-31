import React, { memo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { useSelector, useDispatch, batch } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import first from 'lodash/first'
import last from 'lodash/last'
import { Icon } from 'react-icons-kit'
import IconButton from '@material-ui/core/IconButton'
import { refreshCcw } from 'react-icons-kit/feather/refreshCcw'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'

import {
  dataPointsFetchRequested,
  setSubProp,
  updateTabValue,
  setFailureModeFilters,
  setFailureModeFilterAtLeastOne,
} from '../../../redux/dataInfraSlice'
import CampaignSelector from '../CampaignSelector'
import {
  stringToFailureMode,
  tabValueToEventAnnotationLabel,
} from '../utils/index'

import NegativeFilter from './NegativeFilters'
import useStyles from './styles'

function Header() {
  const { palette } = useTheme()
  const dispatch = useDispatch()

  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const selectedCampaign = useSelector(
    state => state.dataInfra.selectedCampaign,
  )
  const dataPointsLastUpdatedAt = useSelector(
    state => state.dataInfra.dataPointsLastUpdatedAt,
  )
  const dataPointsActiveFilter = useSelector(
    state => state.dataInfra.dataPointsActiveFilter,
  )
  const dataPointsLoading = useSelector(
    state => state.dataInfra.dataPointsLoading,
  )
  const dataPointsCount = useSelector(state => state.dataInfra.dataPointsCount)
  const failureModeFilters = useSelector(
    state => state.dataInfra.failureModeFilters,
  )
  const failureModeFilterAtLeastOne = useSelector(
    state => state.dataInfra.failureModeFilterAtLeastOne,
  )
  const tabValue = useSelector(state => state.dataInfra.tabValue)
  const timezone =
    dataPointsActiveFilter.selectedSites &&
    dataPointsActiveFilter.selectedSites.length === 1
      ? dataPointsActiveFilter.selectedSites[0].timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone

  const refreshDataPoints = () =>
    dispatch(
      dataPointsFetchRequested({
        dataCampaignId: selectedCampaign.id,
        page: 1,
        tsIdentifierStart: dataPointsActiveFilter.startTs,
        tsIdentifierEnd: dataPointsActiveFilter.endTs,
        eventAnnotationLabel: tabValueToEventAnnotationLabel(tabValue),
      }),
    )

  const refreshAndUpdateDataPoints = times => {
    const startTs = (first(times) * 1000).toString()
    const endTs = (last(times) * 1000).toString()
    const failureModeIds = failureModeFilters.map(
      failureModeString => stringToFailureMode(failureModeString)[0],
    )
    batch(() => {
      dispatch(
        setSubProp({
          startTs,
          endTs,
        }),
      )
      dispatch(
        dataPointsFetchRequested({
          dataCampaignId: selectedCampaign.id,
          page: 1,
          tsIdentifierStart: startTs,
          tsIdentifierEnd: endTs,
          eventAnnotationLabel: tabValueToEventAnnotationLabel(tabValue),
          failureModeIds,
          filterAtLeastOne: failureModeFilterAtLeastOne,
        }),
      )
    })
  }

  const handleTabChange = (event, newValue) => {
    batch(() => {
      dispatch(
        updateTabValue({
          tabValue: newValue,
        }),
      )
      dispatch(
        setFailureModeFilters({
          failureModeFilters: [],
        }),
      )
      dispatch(
        setFailureModeFilterAtLeastOne({
          failureModeFilterAtLeastOne: true,
        }),
      )
      dispatch(
        dataPointsFetchRequested({
          dataCampaignId: selectedCampaign.id,
          page: 1,
          tsIdentifierStart: dataPointsActiveFilter.startTs,
          tsIdentifierEnd: dataPointsActiveFilter.endTs,
          eventAnnotationLabel: tabValueToEventAnnotationLabel(newValue),
        }),
      )
    })
  }

  return (
    <Grid
      alignItems='center'
      className={classes.headerContainer}
      container
      direction='row'
      id='header-container'
      justify='space-between'
      spacing={1}
    >
      <Grid item xs={9} className={classes.searchContainer}>
        <CampaignSelector />
        <DateTimeRangePickerV3
          onChange={times => {
            refreshAndUpdateDataPoints(times)
          }}
          startTs={
            dataPointsActiveFilter.startTs
              ? parseInt(dataPointsActiveFilter.startTs, 10) / 1000
              : dataPointsActiveFilter.startTs
          }
          endTs={
            dataPointsActiveFilter.endTs
              ? parseInt(dataPointsActiveFilter.endTs, 10) / 1000
              : dataPointsActiveFilter.endTs
          }
          darkMode={darkMode}
          timezone={timezone}
        />
        {tabValueToEventAnnotationLabel(tabValue) === false &&
          selectedCampaign.validFailureModes && <NegativeFilter />}
      </Grid>
      <Grid item xs={3} className={classes.infoContainer}>
        {dataPointsLastUpdatedAt && !dataPointsLoading && (
          <>
            <Typography className={classes.viewLabel}>
              Updated {moment.unix(dataPointsLastUpdatedAt).fromNow()}
            </Typography>
            <IconButton aria-label='refresh' onClick={refreshDataPoints}>
              <Icon icon={refreshCcw} size={13} />
            </IconButton>
            <span className='am-overline' style={{ color: palette.grey[500] }}>
              <span style={{ color: palette.common.greenBluePastel }}>
                {dataPointsCount}
              </span>{' '}
              Results
            </span>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Tabs
            value={tabValue}
            indicatorColor='primary'
            textColor='primary'
            onChange={handleTabChange}
            centered
          >
            <Tab label='All' />
            <Tab label='Negative' />
            <Tab label='Positive' />
            <Tab label='Unannotated' disabled />
          </Tabs>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default memo(Header)
