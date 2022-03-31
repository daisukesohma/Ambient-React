import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@material-ui/core'
import { get, map, find, forEach } from 'lodash'
// src
import upperFirst from 'utils/text/upperFirst'
import {
  addShape,
  deletePointAnnotationRequested,
  resetShapes,
  selectPointAnnotationId,
  setEditingPointAnnotationId,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import activeStreamPointAnnotations from 'features/StreamConfiguration/selectors/activeStreamPointAnnotations'
import { convertPtsToShapes } from 'features/StreamConfiguration/utils'
import { Icon, Icons } from 'ambient_ui'
import { POINT_ANNOTATION_MODES } from 'features/StreamConfiguration/constants'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'
// on deletion, should probably use optimistic rendering with apollo
//
export default function SavedPoints() {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const entityOptions = useSelector(state => state.streamConfiguration.entities)

  const createPointAnnotationLoading = useSelector(
    state => state.streamConfiguration.createPointAnnotationLoading,
  )
  const deletingPointAnnotationId = useSelector(
    state => state.streamConfiguration.deletingPointAnnotationId,
  )
  const pointAnnotationMode = useSelector(
    state => state.streamConfiguration.pointAnnotationMode,
  )
  const deletePointAnnotationLoading = useSelector(
    state => state.streamConfiguration.deletePointAnnotationLoading,
  )
  const updatePointAnnotationLoading = useSelector(
    state => state.streamConfiguration.updatePointAnnotationLoading,
  )
  const isEditing = pointAnnotationMode === POINT_ANNOTATION_MODES.EDIT
  const isAdding = pointAnnotationMode === POINT_ANNOTATION_MODES.ADD
  const isHovering = !isEditing && !isAdding

  const editingPointAnnotationId = useSelector(
    state => state.streamConfiguration.editingPointAnnotationId,
  )
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const getEntityIdFromPtAnnotationId = ptAnnotationId =>
    get(
      find(
        activeStream.entities,
        e => get(e, 'pointAnnotations[0].id') === ptAnnotationId,
      ),
      'id',
    )

  const allPointAnnotations = useSelector(activeStreamPointAnnotations)

  const onSelect = pointAnnotationId => {
    dispatch(selectPointAnnotationId({ id: pointAnnotationId }))
  }

  const handleDelete = id => {
    dispatch(resetShapes())
    dispatch(
      deletePointAnnotationRequested(
        { 
          id, 
          entityId: getEntityIdFromPtAnnotationId(id),
        })
    )
  }

  const handleHover = pts => {
    if (isHovering) {
      onSelect(pts.id)

      // add shapes to redux
      const shapes = convertPtsToShapes(pts.points)
      dispatch(resetShapes())
      forEach(shapes, shape => {
        dispatch(addShape({ shape }))
      })
    }
  }

  const handleMouseOut = () => {
    if (isHovering) {
      dispatch(resetShapes())
      onSelect(null)
    }
  }

  const handleEditing = id => {
    dispatch(setEditingPointAnnotationId({ id }))
  }

  return (
    <div id='four-point-saved-points'>
      <div className='am-body2' style={{ marginBottom: 16 }}>
        Saved
      </div>
      {createPointAnnotationLoading && (
        <Card className={classes.root}>
          <CardContent>
            <span className={flexClasses.row}>
              <CircularProgress size={14} />
              <span className='am-caption' style={{ marginLeft: 8 }}>
                Saving...
              </span>
            </span>
          </CardContent>
        </Card>
      )}
      {get(allPointAnnotations, 'length') === 0 && (
        <Card className={classes.root}>
          <CardContent>
            <span className={flexClasses.row}>
              <span className='am-caption' style={{ marginLeft: 8 }}>
                You have no saved four point annotations
              </span>
            </span>
          </CardContent>
        </Card>
      )}
      {map(allPointAnnotations, pts => {
        const { id, visible, interior, entity } = pts // also has "points" key
        const entityOptionName = upperFirst(
          get(find(entityOptions, { id: entity.id }), 'name', 'Other'),
        )
        const isEditingPt = editingPointAnnotationId === id
        return (
          <Card
            key={id}
            className={classes.root}
            onMouseOver={() => handleHover(pts)}
            onMouseOut={() => {
              if (!isEditingPt) {
                handleMouseOut()
              }
            }}
          >
            <CardContent>
              <div style={{ cursor: 'pointer' }}>
                <div>
                  <div className='am-caption'>
                    Entity Id: {getEntityIdFromPtAnnotationId(id)}
                  </div>
                  <div className='am-caption'>Entity: {entityOptionName}</div>
                  <div className={'am-caption'}>
                    Interior? {interior ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <span style={{ marginTop: -8 }}>
                <Tooltip
                  placement='bottom'
                  content={<TooltipText>Show / Hide</TooltipText>}
                />
              </span>
              {!isAdding && (
                <>
                  <Tooltip
                    placement='bottom'
                    content={<TooltipText>Edit</TooltipText>}
                  >
                    {isEditingPt && updatePointAnnotationLoading ? (
                      <span className={flexClasses.row}>
                        <CircularProgress size={14} />
                        <span className='am-caption' style={{ marginLeft: 8 }}>
                          Updating...
                        </span>
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          if (isEditingPt) {
                            handleEditing(undefined)
                          } else {
                            handleEditing(id)
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <Icons.Edit width={16} height={16} />
                      </span>
                    )}
                  </Tooltip>
                  <Tooltip
                    placement='bottom'
                    content={<TooltipText>Delete</TooltipText>}
                  >
                    {deletingPointAnnotationId === id &&
                    deletePointAnnotationLoading ? (
                      <span className={flexClasses.row}>
                        <CircularProgress size={14} />
                        <span className='am-caption' style={{ marginLeft: 8 }}>
                          Deleting...
                        </span>
                      </span>
                    ) : (
                      <span onClick={() => handleDelete(id)}>
                        <Icon
                          icon='trash'
                          color={palette.error.main}
                          size={16}
                        />
                      </span>
                    )}
                  </Tooltip>
                </>
              )}
            </CardActions>
          </Card>
        )
      })}
    </div>
  )
}
