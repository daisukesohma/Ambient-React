import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMode } from 'features/StreamConfiguration/streamConfigurationSlice'
import { STREAM_CONFIGURATION_MODES } from 'features/StreamConfiguration/constants'
import useStyles from './styles'

export default function ZoneItem() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const handleModeSelection = selectedMode =>
    dispatch(setMode({ mode: selectedMode }))

  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const { zoneData } = activeStream

  return (
    <div
      className={classes.zoneContainer}
      onClick={() => handleModeSelection(STREAM_CONFIGURATION_MODES.ZONES)}
    >
      {zoneData && (
        <img alt='zone-painting' className={classes.zoneImage} src={zoneData} />
      )}
    </div>
  )
}
