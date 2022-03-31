/* eslint-disable no-use-before-define */
import React from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
// src
import {
  addHistoryItem,
  resetSearch,
  setSearchQuery,
  setSelectedSuggestion,
} from 'redux/forensics/actions'
import { convertSuggestionToQueryInput } from 'utils'
import ForensicsSearchBar from 'components/ForensicsSearchBar'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'

import useForensicData from '../../../../hooks/useForensicData'

import useStyles from './styles'

// We use Autocomplete in controlled mode, by passing it a value prop
// We also set it to be in freeSolo mode, which allows any input, not just one from the selected values.
// This allows 2 things:
//  1. thesaurus values to implement later (ie. can freely enter any words, and we can start to match synonyms)
//  2. the current value doesnt have to be an option that is provided, so we don't have to hack an empty value by inserting it
// into the suggestions array. It also used strict equality to test if the value matched an option, which caused even more
// problems.
//
const SuggestSearchBar = () => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode, isMobileOnly })

  const searchSuggestions = useSelector(
    state => state.forensics.searchSuggestions,
  )
  const selectedSuggestion = useSelector(
    state => state.forensics.selectedSuggestion,
  )
  const historySuggestions = useSelector(state => state.forensics.history)

  const [fetchRegionStats, fetchEntities] = useForensicData()

  const handleChange = (event, newValue) => {
    if (
      newValue &&
      newValue.params // since we allow freeSolo, ie. any newValue, we check to see its in the right shape
    ) {
      // console.log('CHANGE', searchSuggestions, newValue)
      // transform input object of suggestions into QueryInput! object
      const searchParams = convertSuggestionToQueryInput(newValue)
      const { params } = newValue

      batch(() => {
        dispatch(setSearchQuery(searchParams)) // store the search params for later implicit querying
        dispatch(setSelectedSuggestion(newValue)) // send the object by strict equality reference to store
        dispatch(addHistoryItem(newValue))
        fetchRegionStats({ query: searchParams })
        fetchEntities({ query: searchParams })
      })

      trackEventToMixpanel(MixPanelEventEnum.FORENSICS_SEARCH, {
        searchType: searchParams.searchType,
        threatSignatureName: params.name,
        query: params.query,
        accessAlarmType: params.accessAlarmType,
      })
    } else {
      // if value is a string, or cleared value
      dispatch(resetSearch())
    }
  }

  // get history suggestion names
  // maybe optimize by adding this to the historySuggestions map below, to potentially cut
  // down number of maps by 1
  const historyNames = [...historySuggestions.map(item => item.params.name)]

  // show history suggestions and search suggestions
  // add in a isHistory prop to group by
  const groupedOptions = [
    ...historySuggestions.map(s => ({ ...s, isHistory: true })).reverse(),
    ...searchSuggestions
      .map(s => ({ isHistory: false, ...s }))
      .filter(e => !historyNames.includes(e.params.name))
      .sort((a, b) => -b.params.name.localeCompare(a.params.name)),
  ]

  const getOptions = () => {
    return [...groupedOptions].sort((a, b) => b.isHistory > a.isHistory)
  }

  return (
    <div id='suggestion-search-bar' className={classes.containerRoot}>
      <ForensicsSearchBar
        darkMode={darkMode}
        handleChange={handleChange}
        isMobileOnly={isMobileOnly}
        options={getOptions()}
        selectedSuggestion={selectedSuggestion}
      />
    </div>
  )
}

export default SuggestSearchBar
