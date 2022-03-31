/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import get from 'lodash/get'
import map from 'lodash/map'

import CarouselContainer from '../CarouselContainer'
import AlertInstance from '../../../../../components/AlertEvent'

import { useStyles } from './styles'

const AlertsCarousel = () => {
  const { account } = useParams()
  const classes = useStyles()
  const alertEvents = useSelector(state =>
    get(state, 'reports.alertEventsSelected'),
  )
  const title = useSelector(state =>
    get(state, 'reports.alertEventsSelectedTitle'),
  )

  const carouselItems = map(alertEvents, alertEvent => (
    <AlertInstance
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
  ))

  return (
    <div className={classes.root}>
      <div className={clsx(classes.title, 'am-h5')}>{title}</div>
      <CarouselContainer
        items={carouselItems}
        noDataMsg='There were no alerts.'
      />
    </div>
  )
}

export default AlertsCarousel
