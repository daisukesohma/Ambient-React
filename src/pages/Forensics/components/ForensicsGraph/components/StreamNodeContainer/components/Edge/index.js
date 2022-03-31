import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

const propTypes = {
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  fill: PropTypes.string,
  hasResults: PropTypes.bool,
}

const defaultProps = {
  x1: null,
  y1: null,
  x2: null,
  y2: null,
  fill: '#0ABFFC',
  hasResults: false,
}

function Edge({ x1, y1, x2, y2, fill, hasResults }) {
  const classes = useStyles({
    hasResults,
    fill,
  })
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={classes.edge} />
    </g>
  )
}

Edge.defaultProps = defaultProps

Edge.propTypes = propTypes

export default Edge
