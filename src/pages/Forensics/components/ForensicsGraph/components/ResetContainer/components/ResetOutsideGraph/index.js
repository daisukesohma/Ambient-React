import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

const propTypes = {
  graphSize: PropTypes.array,
  centerX: PropTypes.number,
  centerY: PropTypes.number,
  handleClick: PropTypes.func,
  r: PropTypes.number,
}

function ResetOutsideGraph({ graphSize, centerX, centerY, r, handleClick }) {
  const classes = useStyles()
  return (
    <>
      <rect
        x={0}
        y={0}
        width={graphSize[1]}
        height={graphSize[0]}
        onClick={handleClick}
        className={classes.resetButton}
        id='inverted-reset-button'
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={r}
        className={classes.innerCircle}
        id='inner-circle'
      />
    </>
  )
}

ResetOutsideGraph.propTypes = propTypes

export default ResetOutsideGraph
