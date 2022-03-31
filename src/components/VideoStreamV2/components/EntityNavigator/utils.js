import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import moment from 'moment'

import EntityMarkerIcon from './EntityMarkerIcon'
import SimpleOption from './SimpleOption'

// Format Dropdown Options from Raw metadata
// Returns list of { label, value } objects which render
//
const getOptionsFromData = data => {
  if (!data) {
    return []
  }

  const LIMIT = 500
  const optionData = data.map(entity => _getOptionDataFromEntity(entity))
  const sortedOptionsDataList = optionData.reverse().slice(0, LIMIT)
  return sortedOptionsDataList.map(d => _constructOptionObject(d))
}

// Options are the Dropdown options
// formats API entity data into data object to render
//
const _getOptionDataFromEntity = entity => {
  const readableTime = moment.unix(entity.startTs).format('LTS')
  const ago = moment.unix(entity.startTs).fromNowOrNow()
  const durationSeconds = entity.widthTs // duration in seconds

  return {
    ago,
    durationSeconds,
    startTs: entity.startTs,
    time: readableTime,
  }
}

const _convertSecondsToReadableDuration = seconds => {
  if (seconds > 60) {
    return moment.duration(seconds, 'seconds').humanize()
  }
  return `${seconds}s`
}

const _constructOptionObject = ({ startTs, time, durationSeconds, ago }) => {
  const { palette } = useTheme()
  const title = (
    <div style={{ marginRight: 6 }}>
      <span style={{ marginRight: 6, fontSize: 14 }}>{time}</span>
      <span
        style={{
          fontSize: 11,
          color: palette.grey[600],
          fontStyle: 'italic',
        }}
      >
        {_convertSecondsToReadableDuration(durationSeconds)}
      </span>
    </div>
  )

  const label = (
    <SimpleOption
      leftIcon={<EntityMarkerIcon />}
      title={title}
      subtitle={ago}
    />
  )

  return {
    label,
    value: startTs,
  }
}

export { getOptionsFromData }
