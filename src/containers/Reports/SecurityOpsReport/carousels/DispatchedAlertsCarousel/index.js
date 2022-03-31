/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import clsx from 'clsx'
import get from 'lodash/get'
import map from 'lodash/map'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import CarouselContainer from '../CarouselContainer'
import AlertInstance from '../../../../../components/AlertEvent'
import ErrorPanel from '../../common/ErrorPanel'
import LoadingContainer from '../../common/LoadingContainer'

import { useStyles } from './styles'
import { GET_DISPATCHED_ALERTS } from './gql'

const DispatchedAlertsCarousel = ({ pollInterval, isTest, severities }) => {
  const classes = useStyles()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const darkMode = useSelector(state => state.settings.darkMode)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const endTs = useSelector(state => get(state, 'reports.endTs', null))

  const queryOptions = {
    variables: {
      accountSlug: account,
      siteSlug: globalSelectedSite,
      startTs,
      endTs,
      isTest,
      severities,
    },
  }

  if (pollInterval) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(GET_DISPATCHED_ALERTS, queryOptions)

  const title = 'Dispatched Alerts'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  const carouselItems = map(
    get(data, 'activityReport.dispatchedAlertEvents', []),
    alertEvent => (
      <AlertInstance
        darkMode={darkMode}
        accountSlug={account}
        alertEvent={alertEvent}
        alertEventStatus={alertEvent.status}
        containerStyle={{ width: '100%' }}
        id={Number(alertEvent.id)}
        idx={alertEvent.id}
        isGQL
        key={`alertEventCarousel-${account}-${alertEvent.id}`}
        name={alertEvent.alert.name}
        node_identifier={get(alertEvent, 'stream.node.identifier')}
        readable_date={alertEvent.readableDate}
        showControls
        showDetails
        site_slug={alertEvent.alert.site.slug}
        site={alertEvent.alert.site.name}
        stream_id={get(alertEvent, 'stream.id')}
        stream={get(alertEvent, 'stream.name')}
        ts_identifier={alertEvent.alertInstances[0].tsIdentifier}
      />
    ),
  )

  return (
    <div className={classes.root}>
      <div className={clsx(classes.title, 'am-h5')}>{title}</div>
      <CarouselContainer
        items={carouselItems}
        noDataMsg='There were no dispatched alerts at the selected Time Range.'
      />
    </div>
  )
}

DispatchedAlertsCarousel.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}
DispatchedAlertsCarousel.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default DispatchedAlertsCarousel
