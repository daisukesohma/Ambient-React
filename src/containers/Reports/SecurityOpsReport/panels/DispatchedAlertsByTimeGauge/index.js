/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { BarGauge, DropdownMenu } from 'ambient_ui'
import get from 'lodash/get'
import find from 'lodash/find'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import config from 'config'
import mockData from '../../mockData'
import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'
import { changeAlertEvents } from '../../../../../redux/reports/actions'

import { GET_DISPATCH_LATENCY_DISTRIBUTION } from './gql'

const DispatchedAlertsByTimeRange = ({ pollInterval, isTest, severities }) => {
  const dispatch = useDispatch()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const endTs = useSelector(state => get(state, 'reports.endTs', null))
  const darkMode = useSelector(state => state.settings.darkMode)
  const isDemo = config.settings.demo

  // TODO: @rodaan make this endpoint more reuseable
  const filterItems = [
    {
      label: '2 min',
      value: '<2',
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
      label: '15 mins',
      value: '10-15',
    },
    {
      label: '>15 mins',
      value: '>15',
    },
  ]
  const [filter, setFilter] = React.useState(filterItems[3])

  const queryOptions = {
    variables: {
      accountSlug: account,
      siteSlug: globalSelectedSite,
      startTs,
      endTs,
      filter,
      isTest,
      severities,
    },
    skip: isDemo,
  }

  if (pollInterval) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(
    GET_DISPATCH_LATENCY_DISTRIBUTION,
    queryOptions,
  )

  const source = isDemo ? mockData : data

  React.useEffect(() => {
    if (source && source.dispatchLatencyDistribution) {
      const index = filterItems.findIndex(item => item.value === filter.value)
      let filteredData = []
      for (let i = filterItems.length - 1; i > index; i--) {
        filteredData = [
          ...filteredData,
          ...source.dispatchLatencyDistribution[i].alertEvents,
        ]
      }
      dispatch(
        changeAlertEvents({
          key: 'filtered_dispatches',
          title: 'Dispatch Request to Resolve after Threshold',
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
          ...source.dispatchLatencyDistribution[i].alertEvents,
        ]
      }
      dispatch(
        changeAlertEvents({
          key: 'filtered_dispatches',
          title: 'Dispatch Request to Resolve after Threshold',
          instances: filteredData,
        }),
      )
    }
  }

  const title = 'Dispatches Resolved under'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  return (
    <BarGauge
      value={(() => {
        let value = 0
        for (let i = 0; i < source.dispatchLatencyDistribution.length; ++i) {
          value += source.dispatchLatencyDistribution[i].value
          if (source.dispatchLatencyDistribution[i].name === filter.value) {
            return value
          }
        }
        return value
      })()}
      total={(() => {
        for (let i = 0; i < source.dispatchLatencyDistribution.length; ++i) {
          if (source.dispatchLatencyDistribution[i].name === filter.value) {
            return source.dispatchLatencyDistribution[i].total
          }
        }
        return 0
      })()}
      title={title}
      description='Dispatched alerts that were resolved within the selected time frame'
      color='primary'
      moreComponent={
        <DropdownMenu
          menuItems={filterItems}
          defaultItemIndex={3}
          handleSelection={onFilterChange}
          selectedItem={find(filterItems, { value: filter.value })}
        />
      }
      inlineShow
    />
  )
}

DispatchedAlertsByTimeRange.defaultProps = {
  pollInterval: null,
  handleFilter: () => {},
  isTest: false,
  severities: [],
}

DispatchedAlertsByTimeRange.propTypes = {
  pollInterval: PropTypes.number,
  handleFilter: PropTypes.func,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default DispatchedAlertsByTimeRange
