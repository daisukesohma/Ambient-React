/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { BarGauge, CircularProgressPanel } from 'ambient_ui'
import { useSelector } from 'react-redux'

import config from 'config'
import mockData from '../../mockData'
import ErrorPanel from '../../common/ErrorPanel'

import { GET_ACKNOWLEDGED_ALERT_EVENTS_NUMBER } from './gql'

function AcknowledgedAlertsComponent({
  accountSlug,
  siteSlug,
  startTs,
  endTs,
  pollInterval,
}) {
  const isDemo = config.settings.demo

  const queryOptions = {
    variables: {
      accountSlug,
      siteSlug,
      startTs,
      endTs,
    },
    skip: isDemo,
  }

  if (pollInterval) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(
    GET_ACKNOWLEDGED_ALERT_EVENTS_NUMBER,
    queryOptions,
  )

  const source = isDemo ? mockData : data
  const title = 'Resolved'

  if (loading) {
    return <CircularProgressPanel title={title} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  return (
    <BarGauge
      value={source.activityReport.numAckedAlertEvents}
      total={source.activityReport.numAlertEvents}
      title={title}
      description='All alerts that were acknowledged or attended to'
      color='primary'
    />
  )
}

AcknowledgedAlertsComponent.defaultProps = {
  startTs: null,
  siteSlug: null,
  accountSlug: null,
  endTs: null,
  pollInterval: null,
}

AcknowledgedAlertsComponent.propTypes = {
  siteSlug: PropTypes.string,
  startTs: PropTypes.number,
  accountSlug: PropTypes.string,
  endTs: PropTypes.number,
  pollInterval: PropTypes.number,
}

export default AcknowledgedAlertsComponent
