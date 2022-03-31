import clone from 'lodash/clone'
import get from 'lodash/get'

import {
  CIRCLE_STEP,
  X_TEXT_OFFSET,
  Y_TEXT_OFFSET,
  TEXT_MULTIPLIER,
  NodeTypeEnum,
} from './constants'

export const generateGraphElementsFromResults = (results, regionLength) => {
  const nodes = []

  for (let i = regionLength; i < results.length; ++i) {
    const result = results[i]
    const stream = {
      id: result.stream.id,
      name: result.stream.name,
      index: i,
      type: NodeTypeEnum.STREAM,
    }

    nodes.push(stream)
  }
}

export const distance = (x1, y1, x2, y2) => {
  const a = Math.abs(x2 - x1)
  const b = Math.abs(y2 - y1)
  return Math.sqrt(a * a + b * b)
}

export const determineOffsetSign = angle => {
  if (angle < 90) {
    return {
      x: 1,
      y: 1,
    }
  }
  if (angle < 180) {
    return {
      x: -1,
      y: 1,
    }
  }
  if (angle < 270) {
    return {
      x: -1,
      y: -1,
    }
  }
  return {
    x: 1,
    y: -1,
  }
}

export const determineOffsetSignForStream = angle => {
  if (angle <= 135 && angle >= 45) {
    return {
      x: -1,
      y: -2.3,
    }
  }
  if (angle <= 315 && angle >= 225) {
    return {
      x: -1,
      y: 4,
    }
  }
  return {
    x: -1,
    y: 1,
  }
}

export const determineCoordinates = (
  nodesInput,
  type,
  nodeDistance,
  flipDirection,
) => {
  const direction = flipDirection || false

  const xTextOffset = X_TEXT_OFFSET[type]
  const yTextOffset = Y_TEXT_OFFSET[type]
  const textRadiusMultiplier = TEXT_MULTIPLIER[type]
  const circleRadius = getCircleRadius(type, nodeDistance)
  const nodeCount = nodesInput.length

  return nodesInput.map((node, i) => {
    const resultNode = clone(node, true)
    const angle = i / (nodeCount / 2)
    const anglePi = direction
      ? Math.abs(angle * Math.PI - Math.PI)
      : angle * Math.PI
    const angleDegree = Math.floor((anglePi / (2 * Math.PI)) * 360)

    const offsetSign =
      type === 'STREAM'
        ? determineOffsetSignForStream(angleDegree)
        : determineOffsetSign(angleDegree)

    resultNode.index = i
    resultNode.cx = circleRadius * Math.cos(anglePi) + node.parentCx
    resultNode.cy = circleRadius * Math.sin(anglePi) + node.parentCy
    resultNode.cxMultiplier = multiplier => {
      return multiplier * circleRadius * Math.cos(anglePi) + node.parentCx
    }
    resultNode.cyMultiplier = multiplier => {
      return multiplier * circleRadius * Math.sin(anglePi) + node.parentCy
    }
    resultNode.cxText =
      textRadiusMultiplier * circleRadius * Math.cos(anglePi) +
      node.parentCx +
      xTextOffset * offsetSign.x
    resultNode.cyText =
      textRadiusMultiplier * circleRadius * Math.sin(anglePi) +
      node.parentCy +
      yTextOffset * offsetSign.y
    resultNode.angleDegree = angleDegree

    return resultNode
  })
}

export const getCircleRadius = (type, orbitSize) => {
  const step = CIRCLE_STEP[type]
  const halfOfScreen = Math.min(orbitSize) / 2
  return halfOfScreen * step
}

export const generateStreamNodeData = (
  streamsOfRegion,
  regionNode,
  streamStats,
  centerX,
  centerY,
) => {
  const regionStreamNodes = []
  if (streamsOfRegion === undefined || streamsOfRegion === null) {
    return []
  }
  for (let i = 0; i < streamsOfRegion.length; ++i) {
    const stream = streamsOfRegion[i]
    const existingStreamNode = regionStreamNodes.find(
      existing => existing.id === stream.id,
    )
    if (!existingStreamNode) {
      const hasResults =
        streamStats.length > 0
          ? streamStats.find(stat => {
              return (
                get(stat, 'stream.id', null) === stream.id && stat.count > 0
              )
            })
          : false

      const newStreamNode = {
        id: stream.id,
        name: stream.name,
        parentCx: centerX,
        parentCy: centerY,
        regionId: regionNode.id,
        hasResults: hasResults ? 1 : 0,
      }
      regionStreamNodes.push(newStreamNode)
    }
  }
  return regionStreamNodes
}
