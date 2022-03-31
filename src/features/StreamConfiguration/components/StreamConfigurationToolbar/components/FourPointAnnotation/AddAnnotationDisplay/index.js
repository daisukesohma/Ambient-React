import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Box, Grid, Fab } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { get, map } from 'lodash'
// src
import {
  DEFAULT_SHAPES,
  ENTITY_ID_DOOR, // ideally we have central place for entity ids -> name, or get name from endpoint
  POINT_ANNOTATION_MODES,
} from 'features/StreamConfiguration/constants'
import {
  addShape,
  createEntityAndPointAnnotationRequested,
  resetShapes,
  setPointAnnotationMode,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import {
  transformPtToGqlArray,
  convertShapesToPoints,
} from 'features/StreamConfiguration/utils'
import getPointLabelFromIndex from 'features/StreamConfiguration/utils/getPointLabelFromIndex'
import { Button, CheckboxWithLabel } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { AnnotationMethodEnum } from 'enums'

import FourPointInfo from '../FourPointInfo'
import BottomDoorInfo from '../FourPointInfo/components/BottomDoorInfo'
import PlacementPointInfo from '../FourPointInfo/components/PlacementPointInfo'

import useStyles from './styles'

export default function AddAnnotationDisplay() {
  const classes = useStyles()
  const [isInterior, setIsInterior] = useState(true)

  const dispatch = useDispatch()
  const shapes = useSelector(state => state.streamConfiguration.shapes)
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )

  const resetPoints = () => dispatch(resetShapes())

  const handleAddShape = shape => dispatch(addShape({ shape }))

  const savePoints = () => {
    const pts = convertShapesToPoints(shapes)
    const gqlPts = map(pts, pt => transformPtToGqlArray(pt))

    dispatch(
      createEntityAndPointAnnotationRequested({
        streamId: activeStream.id,
        entity: {
          annotationType: AnnotationMethodEnum.POINT_ANNOTATION,
          entityId: ENTITY_ID_DOOR,
          streamId: activeStream.id,
        },
        annotation: {
          streamId: activeStream.id,
          points: gqlPts,
          interior: isInterior,
        },
      }),
    )

    resetPoints()
  }

  const handleCancel = () => {
    dispatch(
      setPointAnnotationMode({
        pointAnnotationMode: POINT_ANNOTATION_MODES.DEFAULT,
      }),
    )
    dispatch(resetPoints())
  }

  const determineNextAction = () => {
    const length = get(shapes, 'length')
    let action = () => handleAddShape(DEFAULT_SHAPES.pointAnnotation)
    let type = 'add'

    if (length) {
      if (length === 4) {
        action = () => {
          savePoints()
        }
        type = 'save'
      }
    }

    return {
      action,
      type,
    }
  }

  const nextAction = determineNextAction()

  return (
    <>
      <div className='am-subtitle2' style={{ padding: 8 }}>
        New Point Annotation
      </div>
      <Card className={classes.cardRoot}>
        <div className='am-subtitle2' style={{ padding: 8 }}>
          Entity: Door
        </div>
        <CheckboxWithLabel
          checked={isInterior}
          onChange={() => {
            setIsInterior(!isInterior)
          }}
          label={'Interior'}
        />
        <div>
          {map(shapes, (shape, i) => (
            <div key={i}>
              <span className='am-subtitle2' style={{ marginRight: 8 }}>
                {getPointLabelFromIndex(i)}
              </span>
              <span className='am-caption'>X </span>
              <span className='am-body2'>{shape.props.x}</span>
              <span className='am-caption'>, </span>
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
          <Box
            m={2}
            width='100%'
            display='flex'
            justifyContent='flex-end'
            flexDirection='row'
          >
            <Button variant='text' color='secondary' onClick={handleCancel}>
              Cancel
            </Button>
            {nextAction.type === 'add' ? (
              <Tooltip content={<TooltipText>Add Point</TooltipText>}>
                <span>
                  <Fab size='small' onClick={() => nextAction.action()}>
                    <AddIcon />
                  </Fab>
                </span>
              </Tooltip>
            ) : (
              <Button onClick={() => nextAction.action()}>
                {nextAction.type}
              </Button>
            )}
          </Box>
        </Grid>
      </Card>
    </>
  )
}
