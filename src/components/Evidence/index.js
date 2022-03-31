/*
 * author: rodaan@ambient.ai
 * A evidence clip that can handle both Access Alarms or Alert Events
 * Type of instance will dictate the query used to pull the data
 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CircularProgressPanel, ErrorPanel } from 'ambient_ui'
import { Carousel } from 'react-responsive-carousel'
import { useLazyQuery } from '@apollo/react-hooks'

import { ActivityTypeEnum } from '../../enums'
import EvidenceInstance from '../EvidenceInstance'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

import useStyles from './styles'
import { GET_ALERT_EVENT, GET_ACCESS_ALARM, GET_ALERT_INSTANCE } from './gql'

function Evidence({ type, id, data }) {
  const classes = useStyles()
  const [selectedItem, setSelectedItem] = useState(0)
  const [instanceData, setInstanceData] = useState(data)

  // Determine which type of Evidence to pull to get propery query
  let query
  let instanceQuery
  let variables = {}
  let createdTsField

  switch (type) {
    case ActivityTypeEnum.AlertEventType:
      query = GET_ALERT_EVENT
      variables = {
        alertEventId: id,
      }
      instanceQuery = GET_ALERT_INSTANCE
      createdTsField = 'tsIdentifier' || 'ts_identifier' // eslint-disable-line

      break

    case ActivityTypeEnum.AccessAlarmType:
      query = GET_ACCESS_ALARM
      instanceQuery = GET_ACCESS_ALARM
      variables = {
        accessAlarmId: id,
      }
      break

    default:
      break
  }

  // Only make initial query if it doesn't exist already
  const skip = !data

  const [getInstance, { loading, error, data: instanceDataRes }] = useLazyQuery(
    query,
    {
      variables,
      skip,
    },
  )

  useEffect(() => {
    if (!data) {
      getInstance()
    }
  }, [data, getInstance])

  useEffect(() => {
    if (instanceDataRes) {
      setInstanceData(instanceDataRes)
    }
  }, [instanceDataRes])

  function generateSlides(instances, selected) {
    return (
      instances &&
      instances.map((instance, i) => {
        const createdTs = instance[createdTsField]
        const display =
          i < 50 ? (
            <EvidenceInstance
              uniqueKey={`evidence-instance-${type}-${instance.id}_${i}`}
              selected={selected === i}
              variables={variables}
              query={instanceQuery}
              createdTs={createdTs}
              instance={instance}
            />
          ) : (
            'More of the same'
          )
        return (
          <div
            id={`${type}-${instance.id}`}
            key={`${type}-generated-slide-${instance.id}-${i}`}
            style={{ height: '100%' }}
          >
            {display}
          </div>
        )
      })
    )
  }

  const handleChangeInstance = selected => {
    setSelectedItem(selected)
  }

  if (loading) {
    return <CircularProgressPanel />
  }

  if (error) {
    return <ErrorPanel />
  }

  // Enter next switch statement once data returns
  const instances =
    type === ActivityTypeEnum.AlertEventType
      ? instanceData.alertInstances
      : [instanceData]

  const slides = generateSlides(instances, selectedItem)

  return (
    <div className={classes.root}>
      <Carousel
        showThumbs={false}
        showIndicators={false}
        key={`{type}-carousel-${id}`}
        onChange={handleChangeInstance}
        selectedItem={selectedItem}
      >
        {slides}
      </Carousel>
    </div>
  )
}

Evidence.defaultProps = {
  data: null,
  id: null,
  type: null,
}

Evidence.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  type: PropTypes.string,
}

export default Evidence
