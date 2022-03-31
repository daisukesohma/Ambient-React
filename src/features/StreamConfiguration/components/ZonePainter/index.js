import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Circle, Line } from 'react-konva'
import { Box, Grid } from '@material-ui/core'
import { isEmpty, values, includes, get, compact, each, map } from 'lodash'
// src
import { hexRgba } from 'utils'
import {
  setZoneData,
  addShape,
  selectShape,
  updateStreamRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import LogoAnimated from 'components/LogoAnimated'
import { Button } from 'ambient_ui'

import Shape from '../Shape'
import applyPointToBitMap from '../../utils/applyPointToBitMap'
import {
  LINE_OPACITY,
  PAINTING_TOOLS,
  STREAM_CONFIGURATION_MODES,
} from '../../constants'
import buildBitMap from '../../utils/buildBitMap'
import shapesFromBitMap from '../../utils/shapesFromBitMap'
import StreamStage from '../StreamStage'

import makeStyles from './styles'
import URLImage from './URLImage'

const { ERASER } = PAINTING_TOOLS
const initialBitMap = buildBitMap({ erased: false })

function ZonePainter() {
  const dispatch = useDispatch()
  const isDrawing = useRef(false)
  const imageRef = useRef()
  const bitMap = useRef(initialBitMap)

  const [drawLine, setDrawLine] = useState(null)
  const [isHovering, setHovering] = useState(false)
  const [hoverPosition, setHoverPosition] = useState({ x: null, y: null })
  const mode = useSelector(state => state.streamConfiguration.mode)
  const tool = useSelector(state => state.streamConfiguration.tool)
  const zones = useSelector(state => state.streamConfiguration.zones)
  const shapes = useSelector(state => state.streamConfiguration.shapes)
  const activeZone = useSelector(state => state.streamConfiguration.activeZone)
  const brushSize = useSelector(state => state.streamConfiguration.brushSize)
  const streamUpdateLoading = useSelector(
    state => state.streamConfiguration.streamUpdateLoading,
  )
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )

  const zoneColors = useMemo(() => {
    const colorsMap = {}
    each(zones, zone => {
      colorsMap[zone.id] = zone.color
    })
    return colorsMap
  }, [zones])

  useEffect(() => {
    if (!isEmpty(activeStream.bitMap) && !isEmpty(zoneColors)) {
      const bitmap = shapesFromBitMap(activeStream.bitMap, zoneColors)
      dispatch(setZoneData({ zoneData: bitmap.dataURL() }))
    }
  }, [activeStream, dispatch, zoneColors])

  // clear out any previous bitmaps when switching streams
  useEffect(() => {
    bitMap.current = buildBitMap({ erased: false })
  }, [activeStream])

  const classes = makeStyles({ activeStream }) // may not need activeStream

  const zoneId = tool === ERASER ? 0 : get(activeZone, 'id')
  const stroke = tool === ERASER ? 'white' : get(activeZone, 'color')
  const globalCompositeOperation =
    tool === ERASER ? 'destination-out' : 'source-over'
  const opacity = tool === ERASER ? 1 : LINE_OPACITY

  const isDrawToolActive = includes(values(PAINTING_TOOLS), tool)

  // https://konvajs.org/docs/sandbox/Relative_Pointer_Position.html
  // this function will return pointer position relative to the passed node
  function getRelativePointerPosition(node) {
    const transform = node.getAbsoluteTransform().copy()
    // to detect relative position we need to invert transform
    transform.invert()

    // get pointer (say mouse or touch) position
    const pos = node.getStage().getPointerPosition()

    // now we can find relative point
    return transform.point(pos)
  }

  const handleMouseDown = e => {
    // drawing bitmap
    const relativePosition = getRelativePointerPosition(e.target)
    isDrawing.current = true
    const { x, y } = relativePosition
    setDrawLine({ points: [x, y] })
    bitMap.current = applyPointToBitMap(bitMap.current, x, y, brushSize, zoneId)
  }

  const handleMouseMove = e => {
    const relativePosition = getRelativePointerPosition(e.target)
    const { x, y } = relativePosition
    setHoverBrushPosition(x, y) // e.evt.layerX, e.evt.layerY)

    if (!isDrawing.current) return

    // drawing bitmap
    // no drawing - skipping
    const points = drawLine.points.concat([x, y])
    setDrawLine({ points })
    bitMap.current = applyPointToBitMap(bitMap.current, x, y, brushSize, zoneId)
  }

  const setHoverBrushPosition = (x, y) => {
    if (x && y) {
      requestAnimationFrame(() => setHoverPosition({ x, y }))
    }
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    if (!drawLine) return
    dispatch(
      addShape({
        shape: {
          component: 'Line',
          props: {
            stroke,
            strokeWidth: brushSize,
            opacity,
            lineCap: 'round',
            points: drawLine.points,
            globalCompositeOperation,
          },
        },
      }),
    )
    setDrawLine(null)
  }

  const checkDeselect = e => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === get(imageRef, 'current.imageNode')
    if (clickedOnEmpty) dispatch(selectShape({ index: null }))
  }

  const downloadImage = () => {
    const newTab = window.open()
    newTab.document.body.innerHTML = `<img alt="" src="${activeStream.zoneData}" width="640" height="480">`
  }

  const saveState = () => {
    dispatch(
      updateStreamRequested({
        id: activeStream.id,
        bitMap: bitMap.current,
      }),
    )
    bitMap.current = initialBitMap
  }

  return (
    <>
      <StreamStage
        onMouseDown={isDrawToolActive ? handleMouseDown : checkDeselect}
        onMousemove={isDrawToolActive ? handleMouseMove : null}
        onMouseup={isDrawToolActive ? handleMouseUp : null}
        onMouseEnter={e => {
          setHovering(true)
          requestAnimationFrame(() =>
            setHoverPosition({ x: e.evt.layerX, y: e.evt.layerY }),
          )
        }}
        onMouseLeave={() => setHovering(false)}
        onTouchStart={checkDeselect}
        draggable={!isDrawToolActive}
      >
        {(tool === PAINTING_TOOLS.PEN || tool === PAINTING_TOOLS.ERASER) &&
          isHovering && (
            <Circle
              radius={brushSize / 2}
              x={hoverPosition.x}
              y={hoverPosition.y}
              fill={
                tool === PAINTING_TOOLS.PEN
                  ? hexRgba(get(activeZone, 'color', '#ffffff'), 0.16)
                  : hexRgba('#ffffff', 0.16)
              }
              stroke={
                tool === PAINTING_TOOLS.PEN
                  ? hexRgba(get(activeZone, 'color', '#ffffff'), 1)
                  : hexRgba('#ffffff', 1)
              }
              strokeWidth={1}
            />
          )}
        {!isEmpty(activeStream.zoneData) && (
          <URLImage
            ref={imageRef}
            src={activeStream.zoneData}
            x={0}
            y={0}
            opacity={LINE_OPACITY}
          />
        )}
        {!isEmpty(compact(shapes)) &&
          map(shapes, (shape, index) => (
            <Shape key={index} shape={shape} index={index} />
          ))}
        {drawLine && (
          <Line
            points={drawLine.points}
            stroke={stroke}
            strokeWidth={brushSize}
            opacity={opacity}
            lineCap='round'
            globalCompositeOperation={globalCompositeOperation}
          />
        )}
      </StreamStage>
      {mode === STREAM_CONFIGURATION_MODES.ZONES && (
        <Box className={classes.saveButton}>
          <Box mb={1}>
            <Button onClick={downloadImage}>Download</Button>
          </Box>
          <Box>
            <Button onClick={saveState} loading={streamUpdateLoading}>
              Save
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}

export default ZonePainter
