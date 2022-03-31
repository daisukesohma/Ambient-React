/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { PieChart } from 'ambient_ui'
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

import { GET_ALERT_EVENTS_DISTRIBUTION } from './gql'

const AlertDistributionPieChartComponent = ({
  pollInterval,
  isTest,
  severities,
}) => {
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const endTs = useSelector(state => get(state, 'reports.endTs', null))
  const darkMode = useSelector(state => state.settings.darkMode)
  const isDemo = config.settings.demo

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
    GET_ALERT_EVENTS_DISTRIBUTION,
    queryOptions,
  )

  const source = isDemo ? mockData : data
  const title = 'Alerts by Type'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  const dataArr = map(get(source, 'alertDistribution', []), alertType => ({
    x: alertType.value,
    y: alertType.value,
    label: alertType.name,
  }))

  dataArr.sort((a, b) => a.x - b.x)

  const altOrderedDataArr = []

  while (dataArr.length > 0) {
    if (dataArr.length % 2 === 0) {
      altOrderedDataArr.push(dataArr.splice(0, 1)[0])
    } else {
      altOrderedDataArr.push(dataArr.splice(dataArr.length - 1, 1)[0])
    }
  }

  return (
    <PieChart
      title={title}
      data={altOrderedDataArr}
      clean
      errorMessage='No data in filtered time rage'
    />
  )
}

AlertDistributionPieChartComponent.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}

AlertDistributionPieChartComponent.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default AlertDistributionPieChartComponent
