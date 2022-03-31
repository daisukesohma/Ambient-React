import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, Grid, Box, Fab } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { isEmpty, find, set, toString, get, filter, map } from 'lodash'
// src
import { AnnotationMethodEnum } from 'enums'
import { Button, CheckboxWithLabel, DropdownMenu } from 'ambient_ui'
import EntityItem from '../LayerSelector/components/EntityItem'
import PageTitle from 'components/Page/Title'
import {
  addShape,
  saveEntityConfigRequested,
  deleteEntityConfigRequested,
  removeShape,
  setShapeProps,
  selectShape,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import {
  DEFAULT_SHAPES,
  ENTITY_ID_DOOR,
} from 'features/StreamConfiguration/constants'
import getActiveShape from 'features/StreamConfiguration/selectors/getActiveShape'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

export default function BoundingBoxSelector() {
  const dispatch = useDispatch()
  const entitiesOptions = useSelector(
    state => state.streamConfiguration.entities,
  )

  const [annotationType, setAnnotationType] = useState(
    AnnotationMethodEnum.BOUNDING_BOX,
  )
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const { entities } = activeStream
  const savingBoundingBox = useSelector(
    state => state.streamConfiguration.savingBoundingBox,
  )
  const deletionBoundingBox = useSelector(
    state => state.streamConfiguration.deletionBoundingBox,
  )
  const selectedBoundingBoxEntityId = useSelector(
    state => state.streamConfiguration.selectedBoundingBoxEntityId,
  )
  const shapes = useSelector(state => state.streamConfiguration.shapes)
  const selectedShapeIndex = shapes.findIndex(
    s => s.meta.id === selectedBoundingBoxEntityId,
  )
  const classes = useStyles()

  const entityOptions = entitiesOptions.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
  const activeShape = useSelector(getActiveShape)
  const activeEntity = get(activeShape, 'meta')

  const boundingBox = get(activeShape, 'props', {})
  const entityOptionId = get(activeShape, 'meta.entityId', null)

  const bbox = get(activeShape, 'meta.bbox', [])
  const config = get(activeShape, 'meta.config', JSON.stringify({ entry: 'n' }))
  const boxId = get(activeShape, 'meta.id', null)

  const cursorClasses = useCursorStyles()

  const handleAddShape = newShape => {
    const shape = newShape
    set(shape, 'meta.entityId', ENTITY_ID_DOOR) // NOTE: set default to door
    set(shape, 'rotationEnabled', false)
    dispatch(addShape({ shape }))
  }

  const handleRemove = () => {
    if (boxId) {
      dispatch(deleteEntityConfigRequested({ id: boxId }))
    } else {
      dispatch(removeShape({ index: selectedBoundingBoxEntityId }))
    }
  }

  const handleEntitySelection = entity => {
    dispatch(
      setShapeProps({
        index: selectedShapeIndex,
        meta: {
          entityId: entity.value,
        },
      }),
    )
  }

  const handleConfigChange = event => {
    dispatch(
      setShapeProps({
        index: selectedShapeIndex,
        meta: {
          config: event.target.value,
        },
      }),
    )
  }

  const handleSave = () => {
    dispatch(
      saveEntityConfigRequested({
        bbox: toString(bbox),
        config,
        annotationType,
        entityId: Number(entityOptionId), // only used for create,  saga handles it
        id: boxId, // only used for update, saga handles it
        streamId: activeStream.id, // only used for create,
      }),
    )
  }

  const onSelectEntity = id => {
    dispatch(selectShape({ index: id }))
  }

  return (
    <>
      <Grid container alignContent='center'>
        <Box
          mb={2}
          p={1}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
          width='100%'
        >
          <PageTitle title='Bounding Box' sizeClass='am-h6' />
          <Tooltip
            placement='bottom-end'
            content={<TooltipText>Add Bounding Box Entity</TooltipText>}
          >
            <span>
              <Fab
                size='small'
                onClick={() => handleAddShape(DEFAULT_SHAPES.rect)}
              >
                <AddIcon />
              </Fab>
            </span>
          </Tooltip>
        </Box>
      </Grid>

      {!isEmpty(entities) && (
        <div>
          {map(
            filter(entities, {
              annotationType: AnnotationMethodEnum.BOUNDING_BOX,
            }),
            entity => (
              <EntityItem
                key={entity.id}
                entity={entity}
                onClick={() => onSelectEntity(entity.id)}
                isSelected={entity.id === selectedBoundingBoxEntityId}
              />
            ),
          )}
        </div>
      )}
      <Grid container alignContent='center'>
        {!isEmpty(boundingBox) && (
          <>
            <Grid item xs={12}>
              <Box p={1}>
                <PageTitle title='Editing' sizeClass='am-h6' />
              </Box>
              <Box p={1}>
                <div className='am-caption'>
                  <div>Entity Id: {activeEntity.id}</div>
                </div>
              </Box>
              <Box
                p={1}
                display='flex'
                flexDirection='row'
                alignItems='center'
                justifyContent='space-between'
              >
                <div className='am-caption'>Select entity:</div>
                <DropdownMenu
                  id='threatSignatures-siteSelector'
                  menuItems={entityOptions}
                  selectedItem={find(entityOptions, {
                    value: toString(entityOptionId),
                  })}
                  handleSelection={handleEntitySelection}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box m={1}>
                <TextField
                  required
                  InputProps={{
                    classes: {
                      underline: classes.inputUnderline,
                    },
                  }}
                  className={classes.textField}
                  label='Config Object'
                  value={config}
                  onChange={handleConfigChange}
                  fullWidth
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box ml={1} mt={2} className={cursorClasses.pointer}>
                bbox: {JSON.stringify(bbox)}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={1}>
                <CheckboxWithLabel
                  onChange={() => {
                    let newType
                    if (annotationType === AnnotationMethodEnum.BOUNDING_BOX) {
                      newType = AnnotationMethodEnum.POINT_ANNOTATION
                    } else {
                      newType = AnnotationMethodEnum.BOUNDING_BOX
                    }

                    setAnnotationType(newType)
                  }}
                  label={'Convert to 4 Point Annotation'}
                  checked={
                    annotationType === AnnotationMethodEnum.POINT_ANNOTATION
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                ml={1}
                mt={2}
                mr={1}
                className={cursorClasses.pointer}
                display='flex'
                flexDirection='row'
                alignItems='center'
                justifyContent='flex-end'
              >
                <Button
                  variant='text'
                  onClick={handleRemove}
                  loading={deletionBoundingBox}
                >
                  {' '}
                  {boxId ? 'Delete' : 'Cancel'}{' '}
                </Button>
                <Button onClick={handleSave} loading={savingBoundingBox}>
                  {' '}
                  {boxId ? 'Update' : 'Create'}{' '}
                </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}
