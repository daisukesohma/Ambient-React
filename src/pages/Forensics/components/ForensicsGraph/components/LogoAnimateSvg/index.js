import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import LogoIcon from 'assets/logo_icon.png'

import useStyles from './styles'

function LogoAnimateSvg({ x, y, size }) {
  const hoveredRegion = useSelector(state => state.forensics.hoveredRegion)
  const activeRegions = useSelector(state => state.forensics.activeRegions)

  const classes = useStyles({ size, x, y })
  return (
    <g className={classes.centerText}>
      <image
        x={x - size / 2}
        y={y - size / 2}
        href={LogoIcon}
        className={clsx(classes.logo, {
          hasHovered: hoveredRegion,
          hasActive: activeRegions,
        })}
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
