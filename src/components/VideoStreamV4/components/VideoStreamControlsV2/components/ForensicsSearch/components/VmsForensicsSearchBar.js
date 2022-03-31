/* eslint-disable no-use-before-define */
import React, { useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { useSelector, useDispatch, batch } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
// src
import {
  addHistoryItem,
  resetSearch,
  setSearchQuery,
  setSelectedSuggestion,
  setForensicsSearchFocused,
} from 'redux/slices/videoStreamControls'
import { setIsOpen } from 'redux/slices/reId'
import { convertSuggestionToQueryInput } from 'utils'
import ForensicsSearchBar from 'components/ForensicsSearchBar'

import useStyles from './styles'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

// We use Autocomplete in controlled mode, by passing it a value prop
// We also set it to be in freeSolo mode, which allows any input, not just one from the selected values.
// This allows 2 things:
//  1. thesaurus values to implement later (ie. can freely enter any words, and we can start to match synonyms)
//  2. the current value doesnt have to be an option that is provided, so we don't have to hack an empty value by inserting it
// into the suggestions array. It also used strict equality to test if the value matched an option, which caused even more
// problems.
//
const VmsForensicsSearchBar = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode, isMobileOnly })

  const searchSuggestions = useSelector(
    state => state.videoStreamControls.searchSuggestions,
  )

  const selectedSuggestion = useSelector(
    state => state.videoStreamControls.selectedSuggestion,
  )
  const historySuggestions = useSelector(
    state => state.videoStreamControls.history || [],
  )

  const handleChange = useCallback(
    (event, newValue) => {
      if (
        newValue &&
        newValue.params // since we allow freeSolo, ie. any newValue, we check to see its in the right shape
      ) {
        // transform input object of suggestions into QueryInput! object
        const searchParams = convertSuggestionToQueryInput(newValue)

        batch(() => {
          dispatch(setSearchQuery(searchParams)) // store the search params for later implicit querying
          dispatch(setSelectedSuggestion(newValue)) // send the object by strict equality reference to store
          dispatch(addHistoryItem(newValue))
          dispatch(setIsOpen(false))
        })
      } else {
        // if value is a string, or cleared value
        dispatch(resetSearch({ videoStreamKey }))
      }
    },
    [dispatch, videoStreamKey],
  )

  // show history suggestions and search suggestions
  // add in a isHistory prop to group by
  const groupedOptions = useMemo(
    () => [
      ...historySuggestions.map(s => ({ ...s, isHistory: true })).reverse(),
      ...searchSuggestions
        .map(s => ({ isHistory: false, ...s }))
        .sort((a, b) => -b.params.name.localeCompare(a.params.name)),
    ],
    [historySuggestions, searchSuggestions],
  )

  const getOptions = useCallback(
    () => [...groupedOptions].sort((a, b) => b.isHistory > a.isHistory),
    [groupedOptions],
  )

  const toggleSearchBarOpen = open => {
    dispatch(setForensicsSearchFocused(open))
  }

  return (
    <OutsideClickHandler onOutsideClick={() => toggleSearchBarOpen(false)}>
      <div
        id='vms-forensics-search-bar'
        className={classes.containerRoot}
        onClick={() => toggleSearchBarOpen(true)}
      >
        <ForensicsSearchBar
          darkMode={darkMode}
          handleChange={handleChange}
          isMobileOnly={isMobileOnly}
          options={getOptions()}
          selectedSuggestion={selectedSuggestion}
          willExpandWidth={false}
        />
      </div>
    </OutsideClickHandler>
  )
}
VmsForensicsSearchBar.propTypes = propTypes

export default memo(VmsForensicsSearchBar)
