import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Box, Grid } from '@material-ui/core'
import clsx from 'clsx'
import { get, map } from 'lodash'
// src
import {
  updatePointAnnotationRequested,
  resetShapes,
  setPointAnnotationMode,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import { POINT_ANNOTATION_MODES } from 'features/StreamConfiguration/constants'
import {
  transformPtToGqlArray,
  convertShapesToPoints,
} from 'features/StreamConfiguration/utils'
import FourPointInfo from '../FourPointInfo'
import BottomDoorInfo from '../FourPointInfo/components/BottomDoorInfo'
import PlacementPointInfo from '../FourPointInfo/components/PlacementPointInfo'
import getPointLabelFromIndex from 'features/StreamConfiguration/utils/getPointLabelFromIndex'
import { Button, CheckboxWithLabel } from 'ambient_ui'
import activeStreamPointAnnotations from 'features/StreamConfiguration/selectors/activeStreamPointAnnotations'

import useStyles from './styles'

export default function EditAnnotationDisplay() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const shapes = useSelector(state => state.streamConfiguration.shapes)
  const editingPointAnnotationId = useSelector(
    state => state.streamConfiguration.editingPointAnnotationId,
  )
  const allPointAnnotations = useSelector(activeStreamPointAnnotations)
  const currentPointAnnotation = allPointAnnotations.find(
    a => a.id === editingPointAnnotationId,
  )

  const [isInterior, setIsInterior] = useState(
    get(currentPointAnnotation, 'interior', false),
  )

  const resetPoints = () => dispatch(resetShapes())

  const savePoints = () => {
    const pts = convertShapesToPoints(shapes)
    const gqlPts = map(pts, pt => transformPtToGqlArray(pt))

    dispatch(
      updatePointAnnotationRequested({
        input: {
          pointAnnotationId: editingPointAnnotationId,
          points: gqlPts,
          interior: isInterior,
        },
        streamId: activeStream.id,
      }),
    )

    resetPoints()
  }

  return (
    <>
      <div className='am-subtitle2' style={{ padding: 8 }}>
        Editing
        <span className='am-overline' style={{ marginLeft: 8 }}>
          Id: {editingPointAnnotationId}
        </span>
      </div>
      <Card className={classes.cardRoot}>
        <CheckboxWithLabel
          checked={isInterior}
          onChange={() => {
            setIsInterior(!isInterior)
          }}
          label='Interior'
        />
        <div>
          {map(shapes, (shape, i) => (
            <div key={i}>
              <span className='am-subtitle2' style={{ marginRight: 4 }}>
                {getPointLabelFromIndex(i)}
              </span>
              <span className='am-caption'>X </span>
              <span className='am-body2'>{shape.props.x}</span>
              <span className={clsx('am-caption')}>, </span>
              <span className='am-caption'>Y </span>
              <span className='am-body2'>{shape.props.y}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <FourPointInfo>
            {shapes.length === 4 ? <BottomDoorInfo /> : <PlacementPointInfo />}
          </FourPointInfo>
        </div>
        <Grid container justify='flex-start' alignContent='center'>
          <Box m={2} width='100%' display='flex' justifyContent='flex-end'>
            <Button
              variant='text'
              color='secondary'
              onClick={() =>
                dispatch(
                  setPointAnnotationMode({
                    pointAnnotationMode: POINT_ANNOTATION_MODES.DEFAULT,
                  }),
                )
              }
            >
              Cancel
            </Button>
            <Button onClick={savePoints}>Update</Button>
          </Box>
        </Grid>
      </Card>
    </>
  )
}
