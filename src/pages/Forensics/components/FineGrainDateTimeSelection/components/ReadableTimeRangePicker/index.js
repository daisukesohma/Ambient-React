import React from 'react'
import { Wheel } from 'ambient_ui'
import { useDispatch, useSelector, batch } from 'react-redux'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {
  setSearchTsRange,
  setSelectionTsRange,
  setRangePresetIndex,
} from 'redux/forensics/actions'
import searchRangePresetIndex from 'selectors/forensics/rangePresetIndex'

import useForensicData from '../../../../hooks/useForensicData'

import data from './data'

export default function ReadableTimeRangePicker() {
  const dispatch = useDispatch()
  const rangePresetIndex = useSelector(searchRangePresetIndex)
  const [fetchRegionStats, fetchEntities] = useForensicData()
  const handleSearchRange = (range, rangeIndex) => {
    batch(() => {
      dispatch(setSelectionTsRange(range))
      fetchRegionStats({ startTs: range[0], endTs: range[1] }) // pass in range so we can use batch
      fetchEntities({ startTs: range[0], endTs: range[1] })
      dispatch(setSearchTsRange(range))
      dispatch(setRangePresetIndex(rangeIndex))
    })
  }

  const handleSelection = s => {
    const index = s.details().relativeSlide
    const value = index >= 0 ? data[index].getValue() : null // in case index is negative
    const now = moment().unix()
    if (value) {
      // for null value of "custom"
      handleSearchRange([now - value, now], index)
    } else {
      dispatch(setRangePresetIndex(index))
    }
  }

  return (
    <div
      style={{
        height: 150,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: 160 }}>
        <Wheel
          initIdx={rangePresetIndex}
          length={data.length}
          width={160}
          setValue={(_, idx) => data[idx].label}
          onChange={debounce(handleSelection, 60)}
        />
      </div>
    </div>
  )
}
