/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { RingGauge } from 'ambient_ui'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import get from 'lodash/get'

import config from 'config'
import mockData from '../../mockData'
import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'

import { GET_ALERT_EVENTS_STATUS_DISTRIBUTION } from './gql'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

const TotalAlertsComponent = ({ pollInterval, isTest, severities }) => {
  const { palette } = useTheme()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const endTs = useSelector(state => get(state, 'reports.endTs', null))
  const darkMode = useSelector(state => state.settings.darkMode)
  const isDemo = config.settings.demo

  const colorMap = {
    error: palette.error.main,
    primary: palette.primary.main,
    secondary: palette.secondary.main,
  }

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
    GET_ALERT_EVENTS_STATUS_DISTRIBUTION,
    queryOptions,
  )

  const source = isDemo ? mockData : data
  const title = 'Total Alerts'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  const info = [
    {
      label: 'Resolved',
      value: source.activityReport
        ? source.activityReport.numAckedAlertEvents
        : 0,
      color: 'primary',
      selected: true,
    },
    {
      label: 'Dispatched',
      value: source.activityReport
        ? source.activityReport.numDispatchedAlertEvents
        : 0,
      color: 'secondary',
      selected: false,
    },
    {
      label: 'Outstanding',
      value: source.activityReport
        ? source.activityReport.numOutstandingAlertEvents
        : 0,
      color: 'error',
      selected: false,
    },
  ]

  const total = source.activityReport ? source.activityReport.numAlertEvents : 0

  return (
    <RingGauge
      title={title}
      data={info}
      total={total}
      colorMap={colorMap}
    />
  )
}

TotalAlertsComponent.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}

TotalAlertsComponent.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default TotalAlertsComponent
