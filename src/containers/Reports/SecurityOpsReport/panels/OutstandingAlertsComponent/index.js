/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { BarGauge, CircularProgressPanel } from 'ambient_ui'

import ErrorPanel from '../../common/ErrorPanel'

import { GET_OUTSTANDING_ALERT_EVENTS_NUMBER } from './gql'

function OutstandingAlertsComponent({
  accountSlug,
  siteSlug,
  startTs,
  endTs,
  pollInterval,
}) {
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
    GET_OUTSTANDING_ALERT_EVENTS_NUMBER,
    queryOptions,
  )

  const title = 'Outstanding'
  if (loading) {
    return <CircularProgressPanel title={title} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  return (
    <BarGauge
      value={data.activityReport.numOutstandingAlertEvents}
      total={data.activityReport.numAlertEvents}
      title={title}
      description='Alerts with no action taken'
      color='error'
    />
  )
}

OutstandingAlertsComponent.defaultProps = {
  accountSlug: null,
  siteSlug: null,
  startTs: null,
  endTs: null,
  pollInterval: null,
}

OutstandingAlertsComponent.propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  startTs: PropTypes.number,
  endTs: PropTypes.number,
  pollInterval: PropTypes.number,
}

export default OutstandingAlertsComponent
