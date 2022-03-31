import React, { useEffect, useState } from 'react'
import moment from 'moment'
import get from 'lodash/get'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch, batch } from 'react-redux'
import {
  setSearchTsRange,
  setSelectionTsRange,
  setRangePresetIndex,
  setSearchQuery,
  regionsFetchRequested,
  toggleShouldGenerateNewSearch,
  setSelectedSuggestion,
  selectTimezone,
} from 'redux/forensics/actions'
import { convertSuggestionToQueryInput } from 'utils'

import useForensicData from '../../hooks/useForensicData'

import HeyAmbient from './components/HeyAmbient'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

export default function ForensicsInitialSearchRecommendation() {
  const dispatch = useDispatch()
  const { account } = useParams()
  const sites = useSelector(state => state.forensics.sites)
  const regions = useSelector(state => state.forensics.regions)
  const shouldGenerateNewSearch = useSelector(
    state => state.forensics.shouldGenerateNewSearch,
  )
  const searchSuggestions = useSelector(
    state => state.forensics.searchSuggestions,
  )
  const [, setGlobalSelectedSite] = useGlobalSelectedSite()
  // renderable text
  const [item, setItem] = useState([])

  // selected objects
  const [entity, setEntity] = useState({})
  const [time, setTime] = useState([])
  const [site, setSite] = useState({})
  const [rangeIndex, setRangeIndex] = useState(0)

  const [fetchRegionStats, fetchEntities] = useForensicData()

  const entities = searchSuggestions

  const secInHour = 60 * 60
  const secInDay = secInHour * 24
  const times = [
    { name: 'in the past day', getValue: () => secInDay },
    {
      name: 'earlier today since midnight',
      getValue: () =>
        moment().unix() -
        moment()
          .startOf('day')
          .unix(),
    },
    { name: 'within the past 1 hour', getValue: () => secInHour },
    { name: 'within the past 3 hours', getValue: () => secInHour * 3 },
    { name: 'within the past 6 hours', getValue: () => secInHour * 6 },
  ]

  const generateNewItem = () => {
    const entityIndex = Math.floor(Math.random() * entities.length)
    const randomEntity = entities[entityIndex]
    setEntity(randomEntity)

    const timeIndex = Math.floor(Math.random() * times.length)
    const randomTime = times[timeIndex]
    setTime(randomTime)
    setRangeIndex(timeIndex)

    const siteIndex = Math.floor(Math.random() * sites.length)
    const randomSite = sites[siteIndex]
    setSite(randomSite)

    return [
      get(randomEntity, 'params.name'),
      randomTime.name,
      `on all cameras at the "${randomSite.name}" site`,
    ]
  }

  const searchEntities = () => {
    const value = time.getValue()
    const now = moment().unix()
    const range = [now - value, now]

    // ensures that search suggestions are valid before running a search
    if (entity && entity.params) {
      const searchParams = convertSuggestionToQueryInput(entity)

      batch(() => {
        dispatch(setSearchQuery(searchParams)) // does this change the search bar? if not, it's invisible
        dispatch(setSelectedSuggestion(entity))
        fetchRegionStats({ startTs: range[0], endTs: range[1] }) // pass in range so we can use batch
        fetchEntities({
          query: searchParams,
          startTs: range[0],
          endTs: range[1],
        })
        dispatch(setSelectionTsRange(range))
        dispatch(setRangePresetIndex(rangeIndex))
        setGlobalSelectedSite(site.slug)
        dispatch(selectTimezone(site.timezone))
        dispatch(
          regionsFetchRequested({ accountSlug: account, siteSlug: site.slug }),
        )
        dispatch(setSearchTsRange(range))
      })
    }
  }

  const handleClick = () => {
    searchEntities()
  }

  useEffect(() => {
    if (sites.length > 0) {
      setItem(generateNewItem())
    }
  }, [sites, regions]) // eslint-disable-line

  useEffect(() => {
    if (shouldGenerateNewSearch && sites.length > 0) {
      setItem(generateNewItem())
      dispatch(toggleShouldGenerateNewSearch())
    }
  }, [shouldGenerateNewSearch]) // eslint-disable-line

  return <HeyAmbient item={item} onItemClick={handleClick} />
}
