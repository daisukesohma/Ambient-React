/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'

// src
import { BarGauge } from 'ambient_ui'

import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'

import { GET_UNRESOLVED_DISPATCHED_ALERT_EVENTS } from './gql'

function UnresolvedDispatchedAlertEventsGauge({
  accountSlug,
  siteSlug,
  startTs,
  endTs,
  pollInterval,
  handleFilteredData,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)

  const queryOptions = {
    variables: {
      accountSlug,
      siteSlug,
      startTs,
      endTs,
    },
  }

  if (pollInterval) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(
    GET_UNRESOLVED_DISPATCHED_ALERT_EVENTS,
    queryOptions,
  )

  useEffect(() => {
    if (
      data &&
      data.activityReport &&
      data.activityReport.unresolvedDispatchedAlertEvents
    ) {
      const filteredData = data.activityReport.unresolvedDispatchedAlertEvents
      handleFilteredData({
        title: 'Unresolved Dispatched Alerts',
        alertEvents: filteredData,
      })
    }
    // eslint-disable-next-line
  }, [data])

  const title = 'Unresolved Dispatched Alerts'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  return (
    <BarGauge
      value={data.activityReport.numUnresolvedDispatchedAlertEvents}
      total={data.activityReport.numDispatchedAlertEvents}
      title={title}
      description='Dispatched alert events that have been left unresolved'
      color='error'
    />
  )
}

UnresolvedDispatchedAlertEventsGauge.defaultProps = {
  accountSlug: '',
  siteSlug: '',
  startTs: 1,
  endTs: new Date().getTime(),
  pollInterval: null,
  handleFilter: () => {},
  handleFilteredData: () => {},
}

UnresolvedDispatchedAlertEventsGauge.propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  startTs: PropTypes.number,
  endTs: PropTypes.number,
  pollInterval: PropTypes.number,
  handleFilter: PropTypes.func,
  handleFilteredData: PropTypes.func,
}

export default UnresolvedDispatchedAlertEventsGauge
