/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { BarChart } from 'ambient_ui'
import get from 'lodash/get'
import map from 'lodash/map'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import config from 'config'
import mockData from '../../mockData'
import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'

import { GET_TIME_TO_ACTION_LATENCY_DISTRIBUTION } from './gql'

const colorMap = {
  '<1': 'primary',
  '1-2,': 'primary',
  '2-5,': 'primary',
  '5-10': 'secondary',
  '10-60': 'secondary',
  '>60': 'error',
}

const TimeToActionDistributionChartComponent = ({
  pollInterval,
  isTest,
  severities,
}) => {
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const endTs = useSelector(state => get(state, 'reports.endTs', null))
  const isDemo = config.settings.demo
  const darkMode = useSelector(state => state.settings.darkMode)

  const queryOptions = {
    variables: {
      accountSlug: account,
      siteSlug: globalSelectedSite,
      startTs,
      endTs,
      isTest,
      severities,
    },
    skip: isDemo,
  }

  if (pollInterval) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(
    GET_TIME_TO_ACTION_LATENCY_DISTRIBUTION,
    queryOptions,
  )

  const source = isDemo ? mockData : data
  const title = 'Time to Act on Alert (mins)'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  const dataArr = map(
    get(source, 'timeToActionLatencyDistribution', []),
    timeRange => ({
      title: timeRange.name,
      value: timeRange.value,
      color: colorMap[timeRange.name],
    }),
  )

  return (
    <BarChart
      title={title}
      data={dataArr}
      dataTitle='Count'
      errorMessage='No data in filtered time rage'
    />
  )
}

TimeToActionDistributionChartComponent.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}

TimeToActionDistributionChartComponent.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default TimeToActionDistributionChartComponent
