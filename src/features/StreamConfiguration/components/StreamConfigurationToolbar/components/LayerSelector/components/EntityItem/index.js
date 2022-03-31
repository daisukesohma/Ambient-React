import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, CircularProgress } from '@material-ui/core'
import { get, isEmpty, map } from 'lodash'
import clsx from 'clsx'
// src
import {
  deleteEntityConfigRequested,
  deletePointAnnotationRequested,
  resetShapes,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import { STREAM_CONFIGURATION_MODES } from 'features/StreamConfiguration/constants'
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'
import { useFlexStyles } from 'common/styles/commonStyles'

const propTypes = {
  entity: PropTypes.shape({
    accessReaders: PropTypes.array,
    annotationType: PropTypes.string,
    bbox: PropTypes.array,
    id: PropTypes.number,
    pointAnnotations: PropTypes.array,
  }),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
}

function EntityItem({ entity, isSelected, onClick }) {
  const {
    accessReaders,
    annotationType,
    bbox,
    config,
    id,
    pointAnnotations,
  } = entity
  const { palette } = useTheme()
  const classes = useStyles({ isSelected })
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()

  const mode = useSelector(state => state.streamConfiguration.mode)
  const allPoints = map(pointAnnotations, 'points')
  const deletingEntityConfigId = useSelector(
    state => state.streamConfiguration.deletingEntityConfigId,
  )
  const deletionEntityConfig = useSelector(
    state => state.streamConfiguration.deletionEntityConfig,
  )
  const handleDelete = (id) => {
    if (annotationType === STREAM_CONFIGURATION_MODES.BOUNDING_BOX) {
      dispatch(deleteEntityConfigRequested({ id }))
    } else if (annotationType === STREAM_CONFIGURATION_MODES.POINT_ANNOTATION) {
      if (isEmpty(allPoints)) {
        dispatch(deleteEntityConfigRequested({ id }))
      } else {
        dispatch(resetShapes())
        dispatch(
          deletePointAnnotationRequested(
            { 
              id: get(pointAnnotations[0], 'id'), 
              entityId: id,
            })
        )
      }
    }
  }

  return (
    <div 
      className={clsx(
        flexClasses.row,
        flexClasses.centerBetween,
        classes.entityItemRoot,
      )}
    >
      <div onClick={() => onClick()}>
        <div className='am-caption'>Entity Id: {id}</div>
        <div className='am-caption'>Annotation Type: {annotationType}</div>
        {annotationType === STREAM_CONFIGURATION_MODES.BOUNDING_BOX && (
          <>
            <div className='am-caption'>
              BBox Coordinates: {isEmpty(bbox) ? 'No coordinates' : bbox}
            </div>
            <div className='am-caption'>Config Object: {config}</div>
          </>
        )}
        {annotationType === STREAM_CONFIGURATION_MODES.POINT_ANNOTATION &&
          !isEmpty(allPoints) && (
            <div className='am-caption'>
              <span>4 Pt Coordinates: </span>
              <span>
                {map(allPoints, (ptAnnnotation, i) => (
                  <div key={`annotation-${i}`}>
                    {map(ptAnnnotation, (pt, ptIndex) => (
                      <span key={`pt-${ptIndex}`} style={{ marginRight: 4 }}>
                        ({pt.x}, {pt.y})
                      </span>
                    ))}
                  </div>
                ))}
              </span>
            </div>
          )}

        {isEmpty(accessReaders) ? (
          <Box className='am-caption'>
            <span style={{ color: palette.error.main }}>No Access Readers</span>
          </Box>
        ) : (
          <Box display='flex' flexDirection='row' className='am-caption'>
            <Box className='am-caption'>
              <span>Access Reader:</span>
            </Box>
            <Box display='flex' flexDirection='column' className='am-caption'>
              {map(accessReaders, (reader) => (
                <Box ml={0.5}>{reader.deviceId}</Box>
              ))}
            </Box>
          </Box>
        )}
      </div>
      {mode === STREAM_CONFIGURATION_MODES.DEFAULT && (
        <Box className='am-caption'>
          <Tooltip
            placement='bottom'
            content={<TooltipText>Delete</TooltipText>}
          >
            {deletingEntityConfigId === id && deletionEntityConfig ? (
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
        </Box>
      )}
    </div>
  )
}

EntityItem.propTypes = propTypes

export default EntityItem
