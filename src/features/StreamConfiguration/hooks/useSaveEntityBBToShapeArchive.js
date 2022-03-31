import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { isEmpty, extend, clone, each } from 'lodash'
// src
import { addShape } from 'features/StreamConfiguration/streamConfigurationSlice'
import { DEFAULT_SHAPES } from 'features/StreamConfiguration/constants'

const useSaveEntityBBToShape = ({ entityBoundingBoxes }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isEmpty(entityBoundingBoxes)) {
      each(entityBoundingBoxes, entityBoundingBox => {
        const box = entityBoundingBox.bbox
        if (box) {
          const shape = clone(DEFAULT_SHAPES.rect)
          shape.props = extend({}, DEFAULT_SHAPES.rect.props, {
            x: box[0],
            y: box[1],
            width: box[2] - box[0],
            height: box[3] - box[1],
          })
          shape.meta = {
            bbox: entityBoundingBox.bbox,
            entityId: entityBoundingBox.fk,
            id: entityBoundingBox.pk,
          }

          dispatch(addShape({ shape }))
        }
      })
    }
  }, [entityBoundingBoxes, dispatch])
}

export default useSaveEntityBBToShape
