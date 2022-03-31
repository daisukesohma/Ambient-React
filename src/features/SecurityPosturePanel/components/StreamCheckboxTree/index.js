import React, { useState, useEffect } from 'react'
import CheckboxTree from 'react-checkbox-tree'
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import PropTypes from 'prop-types'

import icons from './components/icons'

const propTypes = {
  videoWallStreams: PropTypes.array,
  regionStreams: PropTypes.array,
  isChecked: PropTypes.func,
  darkMode: PropTypes.bool,
  checkedStreams: PropTypes.array,
}

const defaultProps = {
  videoWallStreams: [],
  regionStreams: [],
  isChecked: () => {},
  darkMode: false,
  checkedStreams: [],
}

const StreamCheckboxTree = ({
  videoWallStreams,
  regionStreams,
  isChecked,
  darkMode,
  checkedStreams,
}) => {
  const [itemsChecked, setChecked] = useState([])
  const [itemsExpanded, setExpanded] = useState([])

  useEffect(() => {
    setChecked(checkedStreams)
  }, [checkedStreams])

  const nodes = []
  if (videoWallStreams.length > 0) {
    nodes.push({
      value: 'videoWalls',
      label: 'Video Walls',
      children: videoWallStreams,
    })
  }

  if (regionStreams.length > 0) {
    nodes.push({
      value: 'regions',
      label: 'Regions',
      children: regionStreams,
    })
  }

  // get all video streams from data, and merge it all into one array
  // get all unique videowalls by id

  // useEffect(() => {
  //   if (streams.length === 0 && videoWalls.length === 0 && regions.length === 0) {
  //     setVideoWalls(calcVideoWalls())
  //     console.log("firing")
  //     setStreams(calcStreams())
  //     setRegions(calcRegions())
  //     console.log("firing")
  //   }
  // }, [data, calcRegions, calcStreams, calcVideoWalls])

  return (
    <div>
      <CheckboxTree
        nodes={nodes}
        checked={itemsChecked}
        expanded={itemsExpanded}
        onCheck={checked => {
          isChecked(checked)
          setChecked([...checked])
        }}
        onExpand={expanded => setExpanded([...expanded])}
        icons={icons(darkMode)}
      />
    </div>
  )
}

StreamCheckboxTree.propTypes = propTypes

StreamCheckboxTree.defaultProps = defaultProps

export default StreamCheckboxTree
