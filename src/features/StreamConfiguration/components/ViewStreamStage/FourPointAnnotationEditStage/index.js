import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Line, Text } from 'react-konva'
import { isEmpty, compact, every, get, map } from 'lodash'
// src
import { hexRgba } from 'utils'
import {
  selectShape,
  setShapeProps,
  setIsHoveringOnAnnotationPoint,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import {
  DEFAULT_SHAPES,
  POINT_ANNOTATION_MODES,
} from 'features/StreamConfiguration/constants'
import activeStreamPointAnnotations from 'features/StreamConfiguration/selectors/activeStreamPointAnnotations'
import NakedShape from 'features/StreamConfiguration/components/NakedShape'
import StreamStage from 'features/StreamConfiguration/components/StreamStage'
import { transformPtToLine } from 'features/StreamConfiguration/utils'

const NO_POINTS_PLACED = [false, false, false, false]

export default function FourPointAnnotationEditStage() {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const [placed, setPlaced] = useState(NO_POINTS_PLACED)

  const pointAnnotationMode = useSelector(
    state => state.streamConfiguration.pointAnnotationMode,
  )

  const isEditing = pointAnnotationMode === POINT_ANNOTATION_MODES.EDIT
  const isAdding = pointAnnotationMode === POINT_ANNOTATION_MODES.ADD

  const allPointAnnotations = useSelector(activeStreamPointAnnotations)
  const auditLoading = useSelector(
    state => state.streamConfiguration.auditLoading,
  )
  const shapes = useSelector(state => state.streamConfiguration.shapes)

  const [linePoints, setLinePoints] = useState(null)

  const generatePoints = ptsArray => {
    return map(ptsArray, pt => transformPtToLine(pt)).flat()
  }

  // on redux reset of shapes, reset points and placed
  useEffect(() => {
    if (isEmpty(shapes)) {
      setLinePoints(null)
      setPlaced(NO_POINTS_PLACED)
    }
  }, [shapes])

  // When user is editing points, update the polygon
  //
  useEffect(() => {
    if (isEditing && shapes.length === 4) {
      updateLines()
    }
  }, [isEditing, shapes]) // eslint-disable-line

  // when getting new annotations, redraw lines
  useEffect(() => {
    updateLines()
  }, [auditLoading]) // eslint-disable-line

  // update local variable when points are moved into the format needed for
  // a) supporting any corner being placed at any time
  // b) updating on movement
  useEffect(() => {
    if (
      every(placed) && // ensure all 4 points have been placed
      every(map(shapes, s => get(s, 'props'))) && // ensure data points are all set (race condition)
      shapes.length === 4
    ) {
      updateLines()
    }
  }, [placed, shapes]) // eslint-disable-line

  const updateLines = () => {
    const newLinePoints = generatePoints(
      map(shapes, pt => ({ x: get(pt, 'props.x'), y: get(pt, 'props.y') })),
    )
    setLinePoints(newLinePoints)
  }

  const onSelect = (shape, index) => e => {
    dispatch(selectShape({ index }))
  }

  //  Checks whether each of the four points has been "placed",
  // ie. moved from original center position to any other position.
  // 'placed' is a local state variable with [true, true, false, false]
  // true represents the first point has been placed, etc.
  //
  const updatePlacedIndex = index => {
    const newPlaced = [...placed] // copy
    newPlaced[index] = true // replace
    setPlaced(newPlaced) // set to state
  }

  const extendShapeProps = (shape, index) => {
    switch (shape.component) {
      case 'Circle':
        return {
          radius: isEditing || isAdding ? 12 : 3,
          opacity: isEditing || isAdding ? 0.3 : 1,
          onClick: onSelect(shape, index),
          onTap: onSelect(shape, index),
          draggable: true,
          onDragStart: e => {
            dispatch(
              setShapeProps({
                index,
                props: {
                  ...DEFAULT_SHAPES.pointAnnotation.dragProps,
                },
              }),
            )
          },
          onDragEnd: e => {
            dispatch(
              setShapeProps({
                index,
                props: {
                  x: e.target.x(),
                  y: e.target.y(),
                  ...DEFAULT_SHAPES.pointAnnotation.endProps,
                },
              }),
            )
            updatePlacedIndex(index)
          },
          onMouseEnter: e => {
            // style stage container:
            const container = e.target.getStage().container()
            container.style.cursor = 'pointer'
            const props = placed[index]
              ? DEFAULT_SHAPES.pointAnnotation.placedHoverProps
              : DEFAULT_SHAPES.pointAnnotation.unplacedHoverProps

            dispatch(
              setShapeProps({
                index,
                props,
              }),
            )
            dispatch(
              setIsHoveringOnAnnotationPoint({
                isHoveringOnAnnotationPoint: true,
              }),
            )
          },
          onMouseLeave: e => {
            if (placed[index]) {
              const container = e.target.getStage().container()
              container.style.cursor = 'default'
              dispatch(
                setShapeProps({
                  index,
                  props: {
                    ...DEFAULT_SHAPES.pointAnnotation.endProps,
                  },
                }),
              )
            }

            dispatch(
              setIsHoveringOnAnnotationPoint({
                isHoveringOnAnnotationPoint: false,
              }),
            )
          },
        }
      default:
        return {}
    }
  }

  const getPointShortLabelFromIndex = i => {
    switch (i) {
      case 0:
        return 'TL'
      case 1:
        return 'TR'
      case 2:
        return 'BR'
      case 3:
        return 'BL'
      default:
        return 'none'
    }
  }

  return (
    <StreamStage>
      {(isEditing || (every(placed) && linePoints)) && (
        <>
          <Line
            x={0}
            y={0}
            points={linePoints}
            tension={0}
            closed
            stroke={palette.common.white}
            strokeWidth={1}
            fill={hexRgba(palette.common.greenPastel, 0.16)}
          />
          <Line
            x={0}
            y={0}
            points={linePoints ? linePoints.slice(4) : []}
            tension={0}
            stroke={palette.common.magenta}
            strokeWidth={2}
            fill={hexRgba(palette.common.magenta, 0.66)}
          />
        </>
      )}
      {!isEditing &&
        map(allPointAnnotations, ({ id, points }) => {
          return (
            <>
              <Line
                key={id}
                opacity={1}
                x={0}
                y={0}
                points={generatePoints(points)} // array of {x,y}
                tension={0}
                closed
                stroke={palette.common.white}
                strokeWidth={1}
                fill={hexRgba(palette.common.greenPastel, 0.16)}
              />
              <Line
                x={0}
                y={0}
                points={generatePoints(points).slice(4)}
                tension={0}
                stroke={palette.common.magenta}
                strokeWidth={1.4}
                fill={hexRgba(palette.common.magenta, 0.66)}
              />
            </>
          )
        })}
      {!isEmpty(compact(shapes)) && // shapes are the circles representing the four points
        map(shapes, (shape, index) => (
          <Text
            key={`label-${index}`}
            x={shape.props.x}
            y={shape.props.y}
            offsetX={7}
            offsetY={6}
            fontFamily={'Aeonik-Regular'}
            fill={'white'}
            text={getPointShortLabelFromIndex(index)}
          />
        ))}
      {!isEmpty(compact(shapes)) && // shapes are the circles representing the four points
        map(shapes, (shape, index) => (
          <NakedShape
            key={index}
            shape={shape}
            shapeProps={extendShapeProps(shape, index)}
            index={index}
          />
        ))}
    </StreamStage>
  )
}
