import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import LogoIcon from '../../../../../../assets/logo_icon.png'

import { useStyles } from './styles'

function LogoAnimateSvg({ x, y, size }) {
  const hoveredRegion = useSelector(state => state.contextGraph.hoveredRegion)
  const activeRegion = useSelector(state => state.contextGraph.activeRegion)

  const hoveredAlert = useSelector(state => state.contextGraph.hoveredAlert)
  const activeAlert = useSelector(state => state.contextGraph.activeAlert)

  const hasHovered = hoveredRegion || hoveredAlert
  const hasActive = activeRegion || activeAlert
  const classes = useStyles({ size, x, y })
  return (
    <g className={classes.centerText}>
      <image
        x={x - size / 2}
        y={y - size / 2}
        href={LogoIcon}
        className={clsx(classes.logo, { hasHovered, hasActive })}
      />
    </g>
  )
}

LogoAnimateSvg.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  size: PropTypes.number,
}

export default LogoAnimateSvg
