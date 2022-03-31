import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get, map } from 'lodash'
// src
import Shape from 'features/StreamConfiguration/components/Shape'
import { useSaveEntityBBToShape } from 'features/StreamConfiguration/hooks'
import {
  selectShape,
  setShapeProps,
} from 'features/StreamConfiguration/streamConfigurationSlice'

export default function BoundingBoxes() {
  const dispatch = useDispatch()
  const shapes = useSelector(state => state.streamConfiguration.shapes)
  const selectedBoundingBoxEntityId = useSelector(
    state => state.streamConfiguration.selectedBoundingBoxEntityId,
  )

  // hook to save the db entities to a canvas shape
  useSaveEntityBBToShape()

  // index is actually entityId right now
  const onSelect = (shape, index) => event => {
    dispatch(selectShape({ index }))
  }

  const handleBoundingBoxUpdate = (shape, index) => event => {
    const {
      x,
      y,
      height,
      width,
      rotation,
      scaleX,
      scaleY,
    } = event.currentTarget.attrs
    const realWidth = width * scaleX
    const realHeight = height * scaleY
    const bbox = [
      Math.floor(x),
      Math.floor(y),
      Math.floor(x + realWidth),
      Math.floor(y + realHeight),
    ]
    dispatch(
      setShapeProps({
        index,
        props: { x, y, height, width, rotation },
        meta: { bbox },
      }),
    )
  }

  const extendShapeProps = (shape, index) => {
    const id = get(shape, 'meta.id')
    switch (shape.component) {
      case 'Rect':
        return {
          onClick: onSelect(shape, id),
          onTap: onSelect(shape, id),
          draggable: true,
          onTransform: handleBoundingBoxUpdate(shape, index),
          onTransformEnd: handleBoundingBoxUpdate(shape, index),
          onDragEnd: handleBoundingBoxUpdate(shape, index),
        }
      default:
        return {}
    }
  }

  return map(shapes, (shape, index) => (
    <Shape
      key={index}
      shape={shape}
      shapeProps={extendShapeProps(shape, index)}
      index={index}
      isSelected={get(shape, 'meta.id') === selectedBoundingBoxEntityId}
    />
  ))
}
