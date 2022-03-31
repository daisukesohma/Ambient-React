import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  VmsPropType,
  VmsPropTypeDefault,
} from '../../../../../../../common/data/proptypes'

import EdgesSvgDefinition from './EdgesSvgDefinition'
import Edges from './Edges'

const EdgesOverlay = ({
  moveViewBoxLeft,
  moveViewBoxRight,
  svgWidth,
  onHoverEnter,
  onHoverLeave,
  vms,
}) => {
  return (
    <svg className="edges">
      <EdgesSvgDefinition />
      <Edges
        darkMode={vms.darkMode}
        position={vms.timeline.settings.position}
        svgWidth={svgWidth}
        moveViewBoxLeft={moveViewBoxLeft}
        moveViewBoxRight={moveViewBoxRight}
        onHoverEnter={onHoverEnter}
        onHoverLeave={onHoverLeave}
      />
    </svg>
  )
}

EdgesOverlay.defaultProps = {
  darkMode: false,
  onHoverEnter: () => {},
  onHoverLeave: () => {},
  vms: VmsPropTypeDefault,
  moveViewBoxLeft: () => {},
  moveViewBoxRight: () => {},
  svgWidth: 0,
}

EdgesOverlay.propTypes = {
  darkMode: PropTypes.bool,
  onHoverEnter: PropTypes.func,
  onHoverLeave: PropTypes.func,
  vms: VmsPropType,
  moveViewBoxLeft: PropTypes.func,
  moveViewBoxRight: PropTypes.func,
  svgWidth: PropTypes.number,
}

const mapStateToProps = state => ({
  vms: state.vms,
})

export default connect(mapStateToProps, null)(EdgesOverlay)
