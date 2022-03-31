import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { Line } from 'react-konva'
import { isEmpty, map } from 'lodash'
// src
import { hexRgba } from 'utils'
import activeStreamPointAnnotations from 'features/StreamConfiguration/selectors/activeStreamPointAnnotations'
import { transformPtToLine } from 'features/StreamConfiguration/utils'

export default function FourPointAnnotationDisplay() {
  const { palette } = useTheme()
  const allPointAnnotations = useSelector(activeStreamPointAnnotations)

  const generatePoints = points => {
    if (!isEmpty(points)) {
      return map(points, point => transformPtToLine(point)).flat()
    }

    return null
  }

  return (
    <>
      {map(allPointAnnotations, ({ id, points }) => (
        <Line
          key={id}
          opacity={1}
          x={0}
          y={0}
          points={generatePoints(points)}
          tension={0}
          closed
          stroke={palette.common.white}
          strokeWidth={1}
          fill={hexRgba(palette.common.greenPastel, 0.16)}
        />
      ))}
    </>
  )
}
