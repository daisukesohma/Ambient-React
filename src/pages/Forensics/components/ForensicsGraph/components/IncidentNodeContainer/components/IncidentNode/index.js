import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import truncate from 'lodash/truncate'

import useStyles from './styles'

const propTypes = {
  name: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  cxText: PropTypes.number,
  cyText: PropTypes.number,
  isHovered: PropTypes.bool,
  isActive: PropTypes.bool,
}

const defaultProps = {
  name: null,
  cx: null,
  cy: null,
  cxText: null,
  cyText: null,
  isHovered: false,
  isActive: false,
}

const IncidentNode = ({
  name,
  cx,
  cy,
  cxText,
  cyText,
  isHovered,
  isActive,
}) => {
  const { palette } = useTheme()
  const classes = useStyles({
    xText: cxText,
    yText: cyText,
    isActive,
  })

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={palette.primary.main} />
      <g>
        <text
          x={cxText}
          y={cyText}
          className={clsx(classes.text, {
            isHovered,
            isActive,
          })}
          fontSize={12}
        >
          {isHovered || isActive
            ? name
            : truncate(name, {
                length: 14,
                separator: /,? +/,
              })}
        </text>
      </g>
    </g>
  )
}

IncidentNode.defaultProps = defaultProps
IncidentNode.propTypes = propTypes

export default IncidentNode
