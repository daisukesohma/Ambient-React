import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { GlyphTriangle } from '@vx/glyph'
import { scaleUtc } from '@vx/scale'
// src
import { hexRgba } from 'utils'

import useStyles from './styles'

IncidentTimelineMarker.propTypes = {
  initTs: PropTypes.number,
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // [date, date]
  xRange: PropTypes.arrayOf(PropTypes.number),
}

export default function IncidentTimelineMarker({ initTs, xDomain, xRange }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const xScale = scaleUtc({ domain: xDomain, range: xRange })

  return (
    <GlyphTriangle
      left={xScale(initTs * 1000)}
      top={0}
      size={6}
      stroke={hexRgba(palette.error.main, 0.8)}
      strokeWidth={2}
      className={classes.glyph}
    />
  )
}
