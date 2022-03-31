/* eslint-disable no-param-reassign */
import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
// src
import { AnalyticsMetricTypeEnum } from 'enums'
import Tooltip from 'components/Tooltip'
import DataTable from 'components/organisms/DataTable'
import { timeRangeToCompare } from '../../utils'
import StackedChartV2 from './StackedChartV2'
import BoxPlotV2 from './BoxPlotV2'
import useStyles from './styles'

const propTypes = {
  xAxis: PropTypes.shape({
    name: PropTypes.string,
    fmt: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
  }),
  yAxes: PropTypes.arrayOf(
    PropTypes.shape({
      fmt: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
      compare: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  metricType: PropTypes.string,
}

function MetricTable({ xAxis, yAxes, metricType }) {
  const classes = useStyles()

  const dataTable = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => {
        const baseObject = { x: value }
        const yObject = yAxes.reduce((result, series) => {
          result[series.key] = parseFloat(series.values[index])
          result[`${series.key}.compare`] = parseFloat(series.compare[index])
          return result
        }, {})
        return { ...baseObject, ...yObject }
      }),
    [xAxis, yAxes],
  )

  const renderValue = useCallback(
    (value, compareValue, offset, isPercentage, forcePositive) => {
      const diff = value - compareValue
      const perc =
        compareValue > 0 ? ((100 * diff) / compareValue).toFixed(2) : null

      const { label: compareLabel } = timeRangeToCompare(Math.abs(offset))
      const tooltipText = `Percentage Change from ${compareLabel}'s count`
      const compareText = perc ? `${perc}%` : 'N/A'
      const isPositive =
        forcePositive ||
        (metricType === AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES
          ? perc >= 0
          : perc <= 0)

      return (
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='flex-start'
        >
          <Box style={{ minWidth: 80 }}>
            {value.toFixed(isPercentage ? 2 : 0)}
            {isPercentage && '%'}
          </Box>
          <Tooltip content={tooltipText}>
            <Box
              pl={0.5}
              pr={0.5}
              ml={1.0}
              mr={0.5}
              className={
                isPositive ? classes.compareIncrease : classes.compareDecrease
              }
              style={{ fontSize: '12px' }}
              borderRadius={8}
            >
              {compareText}
            </Box>
          </Tooltip>
        </Box>
      )
    },
    [classes.compareDecrease, classes.compareIncrease, metricType],
  )

  const tableColumns = useMemo(
    () =>
      [{ title: 'Stream', field: 'x' }].concat(
        filter(yAxes, 'fmt').map(series => ({
          title: series.name,
          field: series.key,
          render: row =>
            renderValue(
              row[series.key],
              row[`${series.key}.compare`],
              series.offset,
              metricType === AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES &&
                series.key === 'percentage_compliant',
              metricType === AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES &&
                series.key !== 'percentage_compliant',
            ),
        })),
      ),
    [yAxes, metricType, renderValue],
  )

  let yAxesForChart = yAxes
  if (metricType === AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES) {
    const enters = find(yAxes, { key: 'enter' })
    const grantedAccesses = find(yAxes, { key: 'Granted Access' })

    const otherAccesses = {
      ...enters,
      key: 'Unauthorized Entries',
      name: 'Unauthorized Entries',
      values: map(get(enters, 'values'), (value, i) =>
        Math.max(Number(value) - Number(grantedAccesses.values[i]), 0),
      ),
    }
    yAxesForChart = [grantedAccesses, otherAccesses]
  }

  return (
    <Grid container>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <div
          // display='flex'
          // flexDirection='column'
          // justifyContent='center'
          style={{ width: '100%', height: '100%' }}
        >
          {metricType === AnalyticsMetricTypeEnum.OCCUPANCY ? (
            <BoxPlotV2 xAxis={xAxis} yAxes={yAxes} />
          ) : (
            <StackedChartV2 xAxis={xAxis} yAxes={yAxesForChart} />
          )}
        </div>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <DataTable
          data={dataTable}
          columns={tableColumns}
          showAddNowButton={false}
          defaultRowsPerPage={10}
          defaultOrderBy={
            metricType === AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES
              ? tableColumns[tableColumns.length - 1].field
              : tableColumns[0].field
          }
          defaultOrder={
            metricType === AnalyticsMetricTypeEnum.AUTHORIZED_ENTRIES
              ? 'asc'
              : 'desc'
          }
        />
      </Grid>
    </Grid>
  )
}

MetricTable.propTypes = propTypes

export default MetricTable
