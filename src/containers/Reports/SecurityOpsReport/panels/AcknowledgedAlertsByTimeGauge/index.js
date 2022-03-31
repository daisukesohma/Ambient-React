/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { BarGauge, DropdownMenu } from 'ambient_ui'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
import find from 'lodash/find'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import config from 'config'
import mockData from '../../mockData'
import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'
import { changeAlertEvents } from '../../../../../redux/reports/actions'

import { GET_ACKNOWLEDGEMENT_LATENCY_DISTRIBUTION } from './gql'

const AcknowledgedAlertsByTimeGauge = ({
  pollInterval,
  isTest,
  severities,
}) => {
  const dispatch = useDispatch()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const endTs = useSelector(state => get(state, 'reports.endTs', null))
  const isDemo = config.settings.demo
  const darkMode = useSelector(state => state.settings.darkMode)

  const filterItems = [
    {
      label: '1 min',
      value: '<1',
    },
    {
      label: '2 min',
      value: '1-2',
    },
    {
      label: '5 mins',
      value: '2-5',
    },
    {
      label: '10 mins',
      value: '5-10',
    },
    {
      label: '60 mins',
      value: '10-60',
    },
    {
      label: '>60 mins',
      value: '>60',
    },
  ]
  const [filter, setFilter] = React.useState(filterItems[2])

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

  if (pollInterval && !isDemo) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(
    GET_ACKNOWLEDGEMENT_LATENCY_DISTRIBUTION,
    queryOptions,
  )

  const source = isDemo ? mockData : data

  useEffect(() => {
    if (source && source.acknowledgementLatencyDistribution) {
      const index = filterItems.findIndex(item => item.value === filter.value)
      let filteredData = []
      for (let i = filterItems.length - 1; i > index; i--) {
        filteredData = [
          ...filteredData,
          ...source.acknowledgementLatencyDistribution[i].alertEvents,
        ]
      }
      dispatch(
        changeAlertEvents({
          key: 'acknowledgement',
          title: 'Alerts Resolved after Threshold',
          instances: filteredData,
        }),
      )
    }
    // eslint-disable-next-line
  }, [source])

  const onFilterChange = value => {
    // we have useEffect inside Dropdown component
    // whenever dropdown menu props are changed, it will re-render this parent component
    // and it will re-create dropdown menu component again so we need to prevent infinite-loop
    if (filter.value !== value.value) {
      setFilter(value)
      const index = filterItems.findIndex(
        item => get(item, 'value') === get(value, 'value'),
      )
      let filteredData = []
      for (let i = filterItems.length - 1; i > index; i--) {
        filteredData = [
          ...filteredData,
          ...source.acknowledgementLatencyDistribution[i].alertEvents,
        ]
      }
      dispatch(
        changeAlertEvents({
          key: 'acknowledgement',
          title: 'Alerts Resolved after Threshold',
          instances: filteredData,
        }),
      )
    }
  }

  const title = 'Alerts Resolved under'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  return (
    <BarGauge
      darkMode={darkMode}
      value={(() => {
        let value = 0
        for (
          let i = 0;
          i < source.acknowledgementLatencyDistribution.length;
          ++i
        ) {
          value += source.acknowledgementLatencyDistribution[i].value
          if (
            source.acknowledgementLatencyDistribution[i].name === filter.value
          ) {
            return value
          }
        }
        return value
      })()}
      total={(() => {
        for (
          let i = 0;
          i < source.acknowledgementLatencyDistribution.length;
          ++i
        ) {
          if (
            source.acknowledgementLatencyDistribution[i].name === filter.value
          ) {
            return source.acknowledgementLatencyDistribution[i].total
          }
        }

        return 0
      })()}
      title={title}
      description='All alerts that were resolved or attended to'
      color='primary'
      moreComponent={
        <DropdownMenu
          menuItems={filterItems}
          handleSelection={onFilterChange}
          defaultItemIndex={2}
          selectedItem={find(filterItems, { value: filter.value })}
        />
      }
      inlineShow
    />
  )
}

AcknowledgedAlertsByTimeGauge.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}

AcknowledgedAlertsByTimeGauge.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default AcknowledgedAlertsByTimeGauge
