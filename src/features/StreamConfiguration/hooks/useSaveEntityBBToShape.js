import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, extend, clone, each, split, get } from 'lodash'
// src
import { AnnotationMethodEnum } from 'enums'
import { addShape } from 'features/StreamConfiguration/streamConfigurationSlice'
import { DEFAULT_SHAPES } from 'features/StreamConfiguration/constants'

// This translates database entity/bounding boxes into canvas shapes to be rendered out
//  on Konva

const useSaveEntityBBToShape = () => {
  const dispatch = useDispatch()
  const shapes = useSelector(state => state.streamConfiguration.shapes)
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const entityConfigs = get(activeStream, 'entities')
    ? get(activeStream, 'entities').filter(
        e => e.annotationType === AnnotationMethodEnum.BOUNDING_BOX,
      )
    : []

  const translateBoxToShape = entityConfigs => {
    each(entityConfigs, entityConfig => {
      // if shape doesn't exist already, then add it
      if (shapes.findIndex(e => e.meta.id === entityConfig.id) < 0) {
        const box = split(entityConfig.bbox, ',')
        if (!isEmpty(box)) {
          const shape = clone(DEFAULT_SHAPES.rect)
          shape.props = extend({}, DEFAULT_SHAPES.rect.props, {
            x: Number(box[0]),
            y: Number(box[1]),
            width: Number(box[2]) - Number(box[0]),
            height: Number(box[3]) - Number(box[1]),
          })
          shape.meta = {
            bbox: entityConfig.bbox,
            entityId: Number(entityConfig.entity.id),
            id: entityConfig.id,
            config: entityConfig.config,
          }

          dispatch(addShape({ shape }))
        }
      }
    })
  }

  useEffect(() => {
    if (!isEmpty(entityConfigs)) {
      translateBoxToShape(entityConfigs)
    }
  }, [activeStream, dispatch])
}

export default useSaveEntityBBToShape
