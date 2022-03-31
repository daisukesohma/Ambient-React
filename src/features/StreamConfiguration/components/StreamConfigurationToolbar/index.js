import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'
import { isEmpty } from 'lodash'
// src
import {
  fetchZonesRequested,
  fetchEntityOptionsRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import { STREAM_CONFIGURATION_MODES } from 'features/StreamConfiguration/constants'

import BoundingBoxSelector from './components/BoundingBoxSelector'
import FourPointAnnotation from './components/FourPointAnnotation'
import PaintTools from './components/PaintTools'
import ZoneSelector from './components/ZoneSelector'
import LayerSelector from './components/LayerSelector'

const StreamConfigurationToolbar = () => {
  const dispatch = useDispatch()
  const mode = useSelector(state => state.streamConfiguration.mode)
  const activeZone = useSelector(state => state.streamConfiguration.activeZone)

  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )

  useEffect(() => {
    dispatch(fetchZonesRequested())
    dispatch(fetchEntityOptionsRequested())
  }, [dispatch])

  if (isEmpty(activeStream))
    return (
      <Box
        width='100%'
        height='100%'
        ml={2}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <div className='am-h6'>Select a stream</div>
      </Box>
    )

  return (
    <>
      {mode === STREAM_CONFIGURATION_MODES.DEFAULT && <LayerSelector />}
      {mode === STREAM_CONFIGURATION_MODES.ZONES && (
        <>
          {activeZone && <PaintTools />}
          <ZoneSelector />
        </>
      )}
      {mode === STREAM_CONFIGURATION_MODES.BOUNDING_BOX && (
        <BoundingBoxSelector />
      )}
      {mode === STREAM_CONFIGURATION_MODES.POINT_ANNOTATION && (
        <FourPointAnnotation />
      )}
    </>
  )
}

export default StreamConfigurationToolbar
