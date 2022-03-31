import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import truncate from 'lodash/truncate'
import { Icon } from 'ambient_ui'

import { threatSignatureAlertsSetHovered } from '../../../../../../redux/contextGraph/actions'
import { getThreatCanonicalId } from '../../../../utils/getThreatCanonicalId'

import useStyles from './styles'

ThreatNode.propTypes = {
  data: PropTypes.any,
  onClick: PropTypes.func,
  isHovered: PropTypes.bool,
  isActive: PropTypes.bool,
}

function ThreatNode({ data, onClick, isHovered, isActive }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const dispatch = useDispatch()

  const hoveredRegion = useSelector(state => state.contextGraph.hoveredRegion)
  const activeRegion = useSelector(state => state.contextGraph.activeRegion)
  const hoveredAlert = useSelector(state => state.contextGraph.hoveredAlert)
  const activeAlert = useSelector(state => state.contextGraph.activeAlert)

  const hasHovered = hoveredRegion || hoveredAlert
  const hasActive = activeRegion || activeAlert

  return (
    <g key={`threat-signature-${data.id}`}>
      <circle
        cx={data.cx}
        cy={data.cy}
        onMouseEnter={() => dispatch(threatSignatureAlertsSetHovered(data.id))}
        onMouseLeave={() => dispatch(threatSignatureAlertsSetHovered(null))}
        onClick={event => onClick(event, data.id)}
        className={clsx(classes.node, {
          isHovered,
          isActive,
          hasHovered,
          hasActive,
        })}
      />
      {isHovered && (
        <text
          x={data.cxText}
          y={data.cyText}
          className={clsx(classes.text, {
            isHovered,
            isActive,
            hasHovered,
            hasActive,
          })}
        >
          {isHovered || isActive
            ? data.name
            : truncate(data.name, {
                length: 20,
                separator: /,? +/,
              })}
        </text>
      )}
      {(isHovered || isActive) && (
        <g>
          <text
            x={data.cxText - 8}
            y={data.cyText + 20}
            className={clsx(classes.subtext, {
              isHovered,
              isActive,
              hasHovered,
              hasActive,
            })}
          >
            {getThreatCanonicalId(data)}{' '}
            {get(data, 'defaultAlert.severity', '').toUpperCase()}
          </text>
          <circle
            cx={data.cxText - 16}
            cy={data.cyText + 18}
            className={clsx(classes.statusBall, {
              isStatusActive: data.status === 'active',
            })}
          />
        </g>
      )}
      {isHovered || isActive ? (
        <Icon
          color={palette.secondary.main}
          icon='polygon'
          size={14}
          x={data.cxText - 18}
          y={data.cyText - 10}
        />
      ) : null}
    </g>
  )
}

export default ThreatNode
