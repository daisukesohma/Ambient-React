import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box, Fab } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
// src
import PageTitle from 'components/Page/Title'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { POINT_ANNOTATION_MODES } from 'features/StreamConfiguration/constants'
import {
  resetShapes,
  setPointAnnotationMode,
} from 'features/StreamConfiguration/streamConfigurationSlice'

import AddAnnotationDisplay from './AddAnnotationDisplay'
import EditAnnotationDisplay from './EditAnnotationDisplay'
import SavedPoints from './SavedPoints'

export default function FourPointAnnotation() {
  const dispatch = useDispatch()
  const pointAnnotationMode = useSelector(
    state => state.streamConfiguration.pointAnnotationMode,
  )
  const handleSetMode = mode => {
    dispatch(resetShapes())
    dispatch(setPointAnnotationMode({ pointAnnotationMode: mode }))
  }

  return (
    <>
      <Grid container justify='flex-start' alignContent='center'>
        <Box
          m={1}
          justifyContent='space-between'
          width='100%'
          display='flex'
          flexDirection='row'
          height={40}
        >
          <PageTitle title='4 Point Annotation' sizeClass='am-h5' />
          {pointAnnotationMode === POINT_ANNOTATION_MODES.DEFAULT && (
            <div>
              <Tooltip
                placement='bottom-end'
                offset={[0, 20]}
                content={<TooltipText>Add New Annotation</TooltipText>}
              >
                <span>
                  <Fab
                    size='small'
                    onClick={() => handleSetMode(POINT_ANNOTATION_MODES.ADD)}
                  >
                    <AddIcon />
                  </Fab>
                </span>
              </Tooltip>
            </div>
          )}
        </Box>
      </Grid>
      <Grid container justify='flex-start' alignContent='center'>
        {pointAnnotationMode === POINT_ANNOTATION_MODES.ADD && (
          <AddAnnotationDisplay />
        )}
        {pointAnnotationMode === POINT_ANNOTATION_MODES.EDIT && (
          <EditAnnotationDisplay />
        )}
        <Box m={1} width='100%'>
          <SavedPoints />
        </Box>
      </Grid>
    </>
  )
}
