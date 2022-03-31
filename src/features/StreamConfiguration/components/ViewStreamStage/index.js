import React from 'react'
import { useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash'
// src
import { STREAM_CONFIGURATION_MODES } from 'features/StreamConfiguration/constants'
import FourPointAnnotationDisplay from 'features/StreamConfiguration/components/FourPointAnnotationDisplay'
import useZoneData from 'features/StreamConfiguration/hooks/useZoneData'
import ZonePainterStage from 'features/StreamConfiguration/components/ZonePainter'
import LogoAnimated from 'components/LogoAnimated'

import StreamStage from '../StreamStage'
import FourPointAnnotationEditStage from './FourPointAnnotationEditStage'
import BoundingBoxes from './BoundingBoxes'
import ZonePainting from './ZonePainting'
import { Grid } from '@material-ui/core'

function ViewStreamStage() {
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const mode = useSelector(state => state.streamConfiguration.mode)

  useZoneData()

  if (isEmpty(activeStream)) {
    return (
      <Grid
        style={{ height: '100%' }}
        container
        direction='row'
        justify='center'
        alignItems='center'
      >
        <Grid item>
          <LogoAnimated />
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      {mode === STREAM_CONFIGURATION_MODES.DEFAULT && (
        <StreamStage>
          <ZonePainting visible={true} src={get(activeStream, 'zoneData')} />
          <BoundingBoxes visible={true} />
          <FourPointAnnotationDisplay />
        </StreamStage>
      )}
      {mode === STREAM_CONFIGURATION_MODES.BOUNDING_BOX && (
        <StreamStage>
          <BoundingBoxes visible={true} />
        </StreamStage>
      )}
      {mode === STREAM_CONFIGURATION_MODES.ZONES && <ZonePainterStage />}
      {mode === STREAM_CONFIGURATION_MODES.POINT_ANNOTATION && (
        <FourPointAnnotationEditStage />
      )}
    </>
  )
}

export default ViewStreamStage
