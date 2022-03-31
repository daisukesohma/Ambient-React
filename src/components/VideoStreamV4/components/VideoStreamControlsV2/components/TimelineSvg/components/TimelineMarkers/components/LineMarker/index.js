import React from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { Line } from '@vx/shape'
import { scaleUtc } from '@vx/scale'

import useStyles from './styles'

const propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date),
    }),
  ),
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // [date, date]
  xRange: PropTypes.arrayOf(PropTypes.number),
}

function LineMarker({ color, data = [], xDomain, xRange }) {
  const classes = useStyles({ color })
  // update scale output ranges
  const xScale = scaleUtc({ domain: xDomain, range: xRange })

  return (
    <Group top={2}>
      {data
        .filter(d => xScale(d.end) > 0)
        .map((d, index) => (
          <Line
            className={classes.line}
            from={{ x: xScale(d.start), y: 1 }}
            key={`line-${index}`}
            to={{ x: xScale(d.end), y: 1 }}
          />
        ))}
    </Group>
  )
}

LineMarker.propTypes = propTypes

export default LineMarker
