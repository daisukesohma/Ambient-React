/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import AlarmIcon from '@material-ui/icons/Alarm'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import moment from 'moment'
import Moment from 'react-moment'
import clsx from 'clsx'
import get from 'lodash/get'
import first from 'lodash/first'
import last from 'lodash/last'
import range from 'lodash/range'
import filter from 'lodash/filter'
import map from 'lodash/map'
import Popover from '@material-ui/core/Popover'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
// src
import { DropdownMenu, CircularProgress, MoreOptionMenu } from 'ambient_ui'
import {
  metricDataFetchRequested,
  deleteMetricRequested,
  setMetricValues,
} from 'redux/slices/analytics'
import Tooltip from 'components/Tooltip'
import ConfirmDialog from 'components/ConfirmDialog'
import FlowChart from '../MetricChart/FlowChartV2'
import OccupancyChartV2 from '../MetricChart/OccupancyChartV2'
import CounterChartV2 from '../MetricChart/CounterChartV2'
import MetricTable from '../MetricTable'
import ConditionsForm from '../ConditionsForm'
import StreamsIndicator from '../StreamsIndicator'
import HeatmapV2 from '../MetricTable/HeatmapV2'
import { timeRangeToCompare } from '../../utils'
import propTypes from '../../propTypes/metric'
import {
  AnalyticsMetricTypeEnum,
  AnalyticsChartTypeEnum,
  AlertStatusEnum,
} from 'enums'
import getMetricProperty from 'selectors/analytics/getMetricProperty'
import FlowChartForAuthorizedEntries from '../MetricChart/FlowChartForAuthorizedEntries'

import datesSet from './datesSet'
import useStyles from './styles'

const POINTS_PER_CHART = 120

const MetricContainer = ({ metric, dashboardId }) => {
  const { palette } = useTheme()
  // const darkMode = useSelector(state => state.settings.darkMode)
  const metrics = useSelector(state => state.analytics.metrics)
  const startTs = useSelector(
    getMetricProperty({ metric, property: 'startTs' }),
  )
  const endTs = useSelector(getMetricProperty({ metric, property: 'endTs' }))
  const dows = useSelector(getMetricProperty({ metric, property: 'dows' }))
  const hods = useSelector(getMetricProperty({ metric, property: 'hods' }))
  const timezone = get(metric, 'site.timezone', DEFAULT_TIMEZONE)

  const refreshFrequency = useSelector(
    state => state.analytics.refreshFrequency,
  )
  const classes = useStyles({ darkMode: false })
  const dispatch = useDispatch()

  const determinedDatesSet = useMemo(
    () =>
      filter(
        datesSet,
        date => date.separator || date.getValue() <= metric.maxTimeRange,
      ),
    [metric.maxTimeRange],
  )

  const minDate = useMemo(
    () =>
      moment()
        .tz(timezone)
        .subtract(metric.maxTimeRange, 'seconds')
        .toDate(),
    [metric.maxTimeRange],
  )

  const dowOptions = useMemo(
    () => [
      { label: 'Every day', value: -1 },
      { label: 'Weekdays', value: [1, 2, 3, 4, 5] },
      { label: 'Weekends', value: [6, 7] },
    ],
    [],
  )

  const hodOptions = useMemo(
    () => [
      { label: 'All Day', value: -1 },
      { label: '8:00 AM - 5:00 PM', value: range(8, 18) },
      { label: '8:00 AM - 6:00 PM', value: range(8, 19) },
      { label: '9:00 AM - 5:00 PM', value: range(9, 18) },
      { label: '9:00 AM - 6:00 PM', value: range(9, 19) },
    ],
    [],
  )

  const breakdownOptions = useMemo(() => {
    const diff = endTs - startTs
    return filter(
      get(metric, 'breakdowns'),
      ({ breakdown }) =>
        breakdown <= diff &&
        (diff / breakdown <= POINTS_PER_CHART ||
          metric.metricType === AnalyticsMetricTypeEnum.UTILIZATION),
    ).map(o => ({ value: o.breakdown, label: `per ${o.label}`, unit: o.label }))
  }, [metric, startTs, endTs])

  useEffect(() => {
    setBreakdown(
      map(breakdownOptions, 'value')
        .sort((a, b) => (a < b ? -1 : 1))
        .find(
          (b, index, arr) =>
            // The next breakdown will be fractional, e.g. 3H should be H breakdown
            // because  3H/1m > 1, 3H/1H > 1 but 3H/1D < 1
            index === breakdownOptions.length - 1 ||
            (endTs - startTs) / arr[index + 1] <= 1,
        ),
    )
  }, [breakdownOptions, startTs, endTs])

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [breakdown, setBreakdown] = useState(null)
  const [conditionsPopoverAnchorEl, setConditionsPopoverAnchorEl] = useState(
    false,
  )
  const metricState = metrics[metric.id]

  const fetchData = useCallback(() => {
    // Dont fetch data until breakdown has been chosen
    if (breakdown && metric && startTs && endTs) {
      const { offset } = timeRangeToCompare(endTs - startTs)
      dispatch(
        metricDataFetchRequested({
          dashboardId,
          metricId: metric.id,
          startTs,
          endTs,
          dows: dows === -1 ? null : dows,
          hods: hods === -1 ? null : hods,
          breakdown,
          compareOffset: offset,
          streamIds: map(metric.streams, 'id'),
        }),
      )
    }
  }, [dispatch, metric, startTs, endTs, dows, hods, breakdown, dashboardId])

  useEffect(() => {
    // Clear existing interval
    const interval =
      refreshFrequency && setInterval(fetchData, refreshFrequency * 1000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [refreshFrequency, fetchData])

  useEffect(() => {
    fetchData()
  }, [dispatch, fetchData])

  const chart = useMemo(() => metricState.data, [metricState])
  const availability = useMemo(
    () =>
      filter(
        [
          { ts: chart && chart.tsMin, prefix: 'after' },
          { ts: chart && chart.tsMax, prefix: 'up to' },
        ],
        ({ ts, prefix }) => ts && ts !== -1,
      ),
    [chart],
  )
  const droppableStyles = useCallback(({ isDraggingOver }) => {
    let backgroundColor = palette.common.white
    if (isDraggingOver) backgroundColor = '#f0f6ff'
    return {
      borderRadius: 10,
      backgroundColor,
    }
  }, [])

  const getMoreMenuItems = useMemo(() => {
    // I={'delete'} on={'Reporting-Analytics'}
    return [
      {
        label: 'Delete',
        onClick: () => setDeleteConfirmOpen(true),
      },
    ]
  }, [setDeleteConfirmOpen])

  const handleDateRange = useCallback(
    dateRange => {
      dispatch(
        setMetricValues({
          metric,
          props: { startTs: first(dateRange), endTs: last(dateRange) },
        }),
      )
    },
    [dispatch, metric],
  )
  return (
    <Droppable droppableId={`${metric.id}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={droppableStyles({ isDraggingOver: snapshot.isDraggingOver })}
        >
          <Box p={0.5} mt={1} mb={1}>
            <Grid container>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='left'
                  m={2}
                >
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    justifyContent='space-between'
                    width={1}
                  >
                    <Box mr={1} maxWidth={0.5}>
                      <Tooltip content={`${metric.name}: ${metric.metricType}`}>
                        <Typography
                          variant='h5'
                          className={clsx(classes.wrap, classes.textColor)}
                        >
                          {metric.name}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Box display='flex' flexDirection='row' alignItems='center'>
                      {metric.metricType ===
                        AnalyticsMetricTypeEnum.OCCUPANCY &&
                        metric.chartType ===
                          AnalyticsChartTypeEnum.TIME_BREAKDOWN && (
                          <Box mr={0.5}>
                            <IconButton
                              size='small'
                              className={
                                metric.threshold &&
                                metric.alert &&
                                metric.alert.status !== AlertStatusEnum.DELETED
                                  ? classes.conditionSetButton
                                  : classes.conditionUnsetButton
                              }
                              onClick={e => {
                                setConditionsPopoverAnchorEl(
                                  conditionsPopoverAnchorEl
                                    ? null
                                    : e.currentTarget,
                                )
                              }}
                            >
                              <AlarmIcon />
                            </IconButton>
                          </Box>
                        )}
                      <Box>
                        <MoreOptionMenu
                          noBackground
                          darkMode={false}
                          menuItems={getMoreMenuItems}
                        />
                      </Box>
                    </Box>
                    <ConfirmDialog
                      open={deleteConfirmOpen}
                      onClose={() => {
                        setDeleteConfirmOpen(false)
                      }}
                      onConfirm={() => {
                        dispatch(deleteMetricRequested({ id: metric.id }))
                        setDeleteConfirmOpen(false)
                      }}
                      content='Are you sure you want to delete this metric?'
                    />
                    <Popover
                      open={Boolean(conditionsPopoverAnchorEl)}
                      anchorEl={conditionsPopoverAnchorEl}
                      onClose={() => {
                        setConditionsPopoverAnchorEl(null)
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <ConditionsForm
                        metric={metric}
                        onClose={() => {
                          setConditionsPopoverAnchorEl(null)
                        }}
                      />
                    </Popover>
                  </Box>
                  <Box mb={0.5} mt={0.5}>
                    <Typography
                      variant='subtitle1'
                      className={classes.metricSubtext}
                    >
                      {get(metric, 'includeZones', []).length > 0
                        ? `Only on zones ${map(
                            metric.includeZones,
                            'name',
                          ).join(' and ')}`
                        : get(metric, 'excludeZones', []).length > 0
                        ? `Anywhere except zones ${map(
                            metric.excludeZones,
                            'name',
                          ).join(' and ')}`
                        : `Anywhere on the chosen streams`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box
                  display='flex'
                  flexDirection='column'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='center'
                    width={1}
                  >
                    <Box mb={1} className={classes.whiteSpace}>
                      <StreamsIndicator metric={metric} />
                    </Box>
                    <Box mb={1} ml={1} mr={-1}>
                      <DateTimeRangePickerV3
                        datesSet={determinedDatesSet}
                        onChange={handleDateRange}
                        startTs={startTs}
                        endTs={endTs}
                        darkMode={false}
                        minDate={minDate}
                        preSetsInLabels
                        timezone={timezone}
                      />
                    </Box>
                  </Box>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='flex-end'
                    style={{ width: '100%' }}
                    flexWrap='wrap'
                  >
                    <Box mr={1}>
                      <DropdownMenu
                        menuItems={dowOptions}
                        handleSelection={({ value }) => {
                          dispatch(
                            setMetricValues({
                              metric,
                              props: { dows: value },
                            }),
                          )
                        }}
                        selectedItem={dowOptions.find(
                          item => item.value === dows,
                        )}
                      />
                    </Box>
                    <Box mr={1}>
                      <DropdownMenu
                        menuItems={hodOptions}
                        handleSelection={({ value }) => {
                          dispatch(
                            setMetricValues({
                              metric,
                              props: { hods: value },
                            }),
                          )
                        }}
                        selectedItem={hodOptions.find(
                          item => item.value === hods,
                        )}
                      />
                    </Box>
                    <Box>
                      <DropdownMenu
                        menuItems={breakdownOptions}
                        handleSelection={({ value }) => {
                          setBreakdown(value)
                        }}
                        selectedItem={breakdownOptions.find(
                          item => item.value === breakdown,
                        )}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                {!metricState.data &&
                  (metricState.loading || metricState.deleting) && (
                    <Box
                      m={1}
                      className={
                        metric.chartType !==
                          AnalyticsChartTypeEnum.STREAM_BREAKDOWN &&
                        classes.chartContainer
                      }
                      display='flex'
                      flexDirection='row'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <CircularProgress size={40} />
                    </Box>
                  )}
              </Grid> */}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box
                  m={1}
                  className={
                    metric.chartType !==
                      AnalyticsChartTypeEnum.STREAM_BREAKDOWN &&
                    classes.chartContainer
                  }
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  alignItems={
                    !metricState.data &&
                    (metricState.loading || metricState.deleting)
                      ? 'center'
                      : 'unset'
                  }
                >
                  {!metricState.data &&
                    (metricState.loading || metricState.deleting) && (
                      <CircularProgress size={40} />
                    )}
                  {chart && (
                    <Paper elevation={0} classes={{ root: classes.paperRoot }}>
                      {metric.metricType === AnalyticsMetricTypeEnum.FLOW &&
                        metric.chartType ===
                          AnalyticsChartTypeEnum.TIME_BREAKDOWN && (
                          <FlowChart
                            xAxis={chart.xAxis}
                            yAxes={chart.yAxes}
                            breakdown={breakdown}
                            timezone={timezone}
                          />
                        )}
                      {metric.metricType ===
                        AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES &&
                        metric.chartType ===
                          AnalyticsChartTypeEnum.TIME_BREAKDOWN && (
                          <FlowChartForAuthorizedEntries
                            xAxis={chart.xAxis}
                            yAxes={chart.yAxes}
                            breakdown={breakdown}
                            timezone={timezone}
                          />
                        )}
                      {metric.metricType ===
                        AnalyticsMetricTypeEnum.OCCUPANCY &&
                        metric.chartType ===
                          AnalyticsChartTypeEnum.TIME_BREAKDOWN && (
                          <OccupancyChartV2
                            xAxis={chart.xAxis}
                            yAxes={chart.yAxes}
                            breakdown={breakdown}
                            threshold={metric.threshold}
                            timezone={timezone}
                          />
                        )}
                      {/* {(metric.metricType === AnalyticsMetricTypeEnum.COUNTER ||
                        metric.metricType ===
                          AnalyticsMetricTypeEnum.UTILIZATION) &&
                        metric.chartType ===
                          AnalyticsChartTypeEnum.TIME_BREAKDOWN && (
                          <CounterChartV2
                            xAxis={chart.xAxis}
                            yAxes={chart.yAxes}
                            breakdown={breakdown}
                            threshold={metric.threshold}
                            timezone={timezone}
                          />
                        )} */}
                      {metric.chartType ===
                        AnalyticsChartTypeEnum.STREAM_BREAKDOWN && (
                        <MetricTable
                          xAxis={chart.xAxis}
                          yAxes={chart.yAxes}
                          metricType={metric.metricType}
                          breakdown={breakdown}
                          timezone={timezone}
                        />
                      )}
                      {metric.chartType === AnalyticsChartTypeEnum.HEATMAP && (
                        <HeatmapV2
                          isPercentage={
                            metric.metricType ===
                            AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES
                          }
                          isPositive={
                            metric.metricType !==
                            AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES
                          }
                          xAxis={chart.xAxis}
                          yAxes={chart.yAxes}
                          breakdown={breakdown}
                          timezone={timezone}
                        />
                      )}
                    </Paper>
                  )}
                </Box>
                {chart && (
                  <Box m={0.5} className={classes.textColor}>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-between'
                      alignItems='center'
                      ml={0.5}
                      paddingTop='24px'
                    >
                      <Box>
                        <Typography variant='subtitle2'>
                          {!chart && 'Loading ...'}
                          <span>
                            {chart &&
                              !chart.tsMin &&
                              !chart.tsMax &&
                              'All data available in this time range'}
                          </span>
                          <span style={{ color: 'red' }}>
                            {chart &&
                              chart.tsMin === -1 &&
                              'No data available in this time range'}
                          </span>
                          <span>
                            {availability.length > 0 && (
                              <>
                                Data available{' '}
                                {availability.map(({ ts, prefix }, index) => (
                                  <>
                                    {index > 0 && ' and '}
                                    {prefix}{' '}
                                    <Moment
                                      unix
                                      tz={timezone}
                                      format='YYYY/MM/DD, HH:mm'
                                    >
                                      {ts}
                                    </Moment>
                                  </>
                                ))}
                              </>
                            )}
                          </span>
                        </Typography>
                      </Box>
                      <Box>
                        <Draggable draggableId={`${metric.id}`} index={0}>
                          {(provided2, snapshot2) => (
                            <div
                              ref={provided2.innerRef}
                              {...provided2.draggableProps}
                              {...provided2.dragHandleProps}
                            >
                              <DragIndicatorIcon fontSize='small' />
                            </div>
                          )}
                        </Draggable>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </div>
      )}
    </Droppable>
  )
}

MetricContainer.propTypes = propTypes

export default MetricContainer
