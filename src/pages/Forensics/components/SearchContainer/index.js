import React, { useEffect } from 'react'
import clsx from 'clsx'
import { isMobileOnly } from 'react-device-detect'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import {
  setSelectionTsRange,
  setSearchTsRange,
  suggestionsFetchRequested,
} from 'redux/forensics/actions'
import isReIdSearchBarVisibleSelector from 'selectors/forensics/isReIdSearchBarVisible'
import ReIdSelector from 'components/ReId/components/ReIdSelector'
import { useFlexStyles } from 'common/styles/commonStyles'
import useFeature from 'common/hooks/useFeature'

import useForensicData from '../../hooks/useForensicData'

import VehicleFilter from './components/VehicleFilter'
import SuggestionSearchBar from './components/SuggestionSearchBar'
import SiteSelector from './components/SiteSelector'
import useStyles from './styles'

export default function SearchContainer() {
  const { account } = useParams()
  const classes = useStyles()

  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const startTs = useSelector(state => state.forensics.selectionTsRange[0])
  const endTs = useSelector(state => state.forensics.selectionTsRange[1])
  const darkMode = useSelector(state => state.settings.darkMode)
  const timezone = useSelector(state => state.forensics.timezone)
  const isVehicleFilterVisible = useSelector(
    state => state.forensics.isVehicleFiltersActive,
  )
  const isVehicleFeatureActive = useFeature({
    accountSlug: account,
    feature: 'COLOR_TYPE_VEHICLE_SEARCH',
  })
  const isReIdSearchBarVisible = useSelector(isReIdSearchBarVisibleSelector)
  const [fetchRegionStats, fetchEntities] = useForensicData()

  const onRangeChange = range => {
    dispatch(setSelectionTsRange(range))
    dispatch(setSearchTsRange(range))
    fetchEntities({ startTs: range[0], endTs: range[1] })
    fetchRegionStats({ startTs: range[0], endTs: range[1] })
  }

  const onVehicleFilterChange = () => {
    fetchEntities()
    fetchRegionStats()
  }

  // get Suggestions
  useEffect(() => {
    dispatch(suggestionsFetchRequested(account))
  }, [dispatch, account])

  return (
    <Grid item lg={12} md={12} sm={12} xs={12}>
      <div className={classes.root}>
        <div
          className={clsx(
            isMobileOnly ? flexClasses.column : flexClasses.row,
            classes.topBar,
          )}
        >
          <SiteSelector />
          <div
            className={flexClasses.row}
            style={{ width: isMobileOnly ? '100%' : 'auto' }}
          >
            {isReIdSearchBarVisible ? (
              <div style={{ marginTop: -42 }}>
                <ReIdSelector isMini />
              </div>
            ) : (
              <SuggestionSearchBar />
            )}
          </div>
          {isVehicleFilterVisible && isVehicleFeatureActive && (
            <VehicleFilter onChange={onVehicleFilterChange} />
          )}
          <DateTimeRangePickerV3
            onChange={onRangeChange}
            startTs={startTs}
            endTs={endTs}
            darkMode={darkMode}
            timezone={timezone}
          />
        </div>
      </div>
    </Grid>
  )
}
