import React from 'react'

const STOP_COLOR = 'transparent'

const LeftEdgeSvg = () => {
  return (
    <linearGradient id="leftEdge">
      <stop offset="0%" stopColor={STOP_COLOR} stopOpacity="1" />
      <stop offset="100%" stopColor={STOP_COLOR} stopOpacity="0" />
    </linearGradient>
  )
}

const RightEdgeSvg = () => {
  return (
    <linearGradient id="rightEdge">
      <stop offset="0%" stopColor={STOP_COLOR} stopOpacity="0" />
      <stop offset="100%" stopColor={STOP_COLOR} stopOpacity="1" />
    </linearGradient>
  )
}

const EdgesSvgDefinition = () => {
  return (
    <defs>
      <LeftEdgeSvg />
      <RightEdgeSvg />
    </defs>
  )
}

export default EdgesSvgDefinition
