/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { BarGauge } from 'ambient_ui'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import config from 'config'
import mockData from '../../mockData'
import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'
import { changeAlertEvents } from '../../../../../redux/reports/actions'

import { GET_DISPATCHED_ALERT_EVENTS } from './gql'

const DispatchedAlertsGauge = ({ pollInterval, isTest, severities }) => {
  const dispatch = useDispatch()
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
    GET_DISPATCHED_ALERT_EVENTS,
    queryOptions,
  )

  const source = isDemo ? mockData : data

  useEffect(() => {
    if (
      source &&
      source.activityReport &&
      source.activityReport.dispatchedAlertEvents
    ) {
      const filteredData = source.activityReport.dispatchedAlertEvents
      dispatch(
        changeAlertEvents({
          key: 'dispatches',
          title: 'Dispatched Alerts',
          instances: filteredData,
        }),
      )
    }
    // eslint-disable-next-line
  }, [source])

  const title = 'Dispatched'
  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  return (
    <BarGauge
      value={
        source.activityReport
          ? source.activityReport.numDispatchedAlertEvents
          : 0
      }
      total={source.activityReport ? source.activityReport.numAlertEvents : 0}
      title={title}
      description='All Alerts where users were dispatched'
      color='secondary'
    />
  )
}

DispatchedAlertsGauge.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}

DispatchedAlertsGauge.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default DispatchedAlertsGauge
