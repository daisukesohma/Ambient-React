import React, { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import min from 'lodash/min'

import useWindowSize from 'common/hooks/useWindowSize'
import StreamSelector from '../StreamSelector'

import ResetContainer from './components/ResetContainer'
import RegionNodeContainer from './components/RegionNodeContainer'
import StreamNodeContainer from './components/StreamNodeContainer'
import LogoAnimateSvg from './components/LogoAnimateSvg'
import useStyles from './styles'

const EDGE_LENGTH_FACTOR = 5 / 10

const ForensicsGraph = () => {
  const graphRef = useRef(null)

  const selectedRegion = useSelector(state => state.forensics.selectedRegion)
  const showEdges = useSelector(state => get(state, 'forensics.showEdges'))
  const regionStats = useSelector(state => state.forensics.regionStats)

  const classes = useStyles({ showEdges })

  const graphSize = useWindowSize(graphRef) // returns [height, width]
  const getCenterX = useCallback(() => graphSize[1] / 2, [graphSize])
  const getCenterY = useCallback(() => graphSize[0] / 2, [graphSize])

  return (
    <div id='forensicsGraph' ref={graphRef} className={classes.root}>
      <svg className={classes.svgBasis}>
        <ResetContainer
          centerX={getCenterX()}
          centerY={getCenterY()}
          graphSize={graphSize}
        />
        {graphSize.length && (
          <g>
            {graphSize.length && regionStats.length === 0 && (
              <LogoAnimateSvg x={getCenterX()} y={getCenterY()} size={90} />
            )}
            <StreamNodeContainer
              centerX={getCenterX()}
              centerY={getCenterY()}
              graphSize={min(graphSize) * EDGE_LENGTH_FACTOR}
            />
            <RegionNodeContainer
              graphSize={min(graphSize)}
              centerX={getCenterX()}
              centerY={getCenterY()}
            />
          </g>
        )}
      </svg>
      {selectedRegion && (
        <div style={{ width: getCenterX() * 2 }}>
          <StreamSelector />
        </div>
      )}
    </div>
  )
}

ForensicsGraph.propTypes = {
  regions: PropTypes.array,
}

ForensicsGraph.defaultProps = {
  regions: [],
}

export default ForensicsGraph
