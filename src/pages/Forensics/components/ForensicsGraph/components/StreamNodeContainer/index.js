import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
// src
import getRegionStreamsFromStreamNodes from 'selectors/forensics/getRegionStreamsFromStreamNodes'
import { setActiveStream, setHoveredStream } from 'redux/forensics/actions'

import { NodeTypeEnum } from '../../constants'

import useStreamNodes from './hooks/useStreamNodes'
import Edge from './components/Edge'
import StreamNode from './components/StreamNode'

const isDisplayingEdges = true

const StreamNodeContainer = ({ centerX, centerY, graphSize }) => {
  const { palette } = useTheme()
  const activeStream = useSelector(state => state.forensics.activeStream)
  const availableStreamNodes = useSelector(getRegionStreamsFromStreamNodes)
  const streamIdHovered = useSelector(state => state.forensics.streamIdHovered)
  const activeStreamId = useSelector(state => state.forensics.activeStream)

  const dispatch = useDispatch()
  const [isDataUpdated] = useStreamNodes({ centerX, centerY, graphSize }) // eslint-disable-line

  const onStreamClick = (regionId, streamId) => {
    if (streamId) {
      dispatch(setActiveStream({ regionId, streamId }))
    }
  }

  const setHoveredStreamId = id => {
    dispatch(setHoveredStream(id))
  }

  return availableStreamNodes.map((streamNode, index) => {
    const getFill = () => {
      if (activeStream === streamNode.id) return palette.primary[500]
      if (streamNode.hasResults) return palette.common.white
      return palette.grey[300]

      // if (activeStream === streamNode.id) return 'blue'
      // if (streamNode.hasResults) return 'red'
      // return 'green'
    }

    return (
      <g key={`${streamNode.id}`}>
        {isDisplayingEdges && (
          <Edge
            x1={streamNode.parentCx}
            y1={streamNode.parentCy}
            x2={streamNode.cx}
            y2={streamNode.cy}
            hasResults={!!streamNode.hasResults}
          />
        )}
        <StreamNode
          key={`${NodeTypeEnum.STREAM}-${streamNode.id}`}
          data={{
            ...streamNode,
          }}
          cx={streamNode.cx}
          cy={streamNode.cy}
          cxText={streamNode.cxText}
          cyText={streamNode.cyText}
          handleEnter={() => setHoveredStreamId(streamNode.id)}
          handleLeave={() => setHoveredStreamId(null)}
          name={streamNode.name}
          fill={getFill()}
          handleClick={() => onStreamClick(streamNode.regionId, streamNode.id)}
          hasResults={!!streamNode.hasResults}
          hasActive={activeStream}
          isHovered={streamNode.id === streamIdHovered}
          isActive={streamNode.id === activeStreamId}
        />
      </g>
    )
  })
}

export default StreamNodeContainer
