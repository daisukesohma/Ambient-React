import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  handleClick: PropTypes.func,
}

function ResetCenter({ x, y, r, handleClick }) {
  const { palette } = useTheme()
  const cursorClasses = useCursorStyles()
  const [isHovered, setIsHovered] = useState(false)
  const classes = useStyles({ r, isHovered })

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={r}
        stroke={palette.text.primary}
        strokeOpacity={isHovered ? 1 : 0.5}
        strokeDasharray={6}
        fill={palette.primary[300]}
        fillOpacity={isHovered ? 0.25 : 0}
        onClick={handleClick}
        className={clsx(classes.root, cursorClasses.pointer)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <text
        x={x}
        y={y + 5}
        stroke={palette.text.primary}
        textAnchor='middle'
        className={clsx('am-overline', classes.text)}
        opacity={isHovered ? 1 : 0.5}
      >
        Reset
      </text>
    </>
  )
}

ResetCenter.propTypes = propTypes

export default ResetCenter
