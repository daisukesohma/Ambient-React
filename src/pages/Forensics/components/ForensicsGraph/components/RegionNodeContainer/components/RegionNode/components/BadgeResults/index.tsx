import React from 'react'
import clsx from 'clsx'

import useStyles from './styles'

interface IProps {
  x: number
  y: number
  count: number
  isActive: boolean
  centerX: number
  centerY: number
  isSelected: boolean
  cxMultiplier: (factor: number) => number
  cyMultiplier: (factor: number) => number
  hasResults: boolean
  hasSelected: boolean
}

const BadgeResults: React.FC<IProps> = ({
  x,
  y,
  centerX,
  centerY,
  cxMultiplier,
  cyMultiplier,
  hasResults,
  hasSelected,
  isSelected,
  count,
  isActive,
}) => {
  const classes = useStyles({
    isActive,
    isSelected,
    hasResults,
    hasSelected,
    x,
    y,
    selectedX: centerX - x,
    selectedY: centerY - y,
    cxMultiplier,
    cyMultiplier,
  })
  let displayCount: number | string = count

  // have to manually increase badge width size depending on the length of count text
  let badgeWidthExtra = 0

  if (count < 1) {
    return null
  } // early return
  if (count > 999) {
    badgeWidthExtra = 18
    displayCount = '999+'
  } else if (count > 99) {
    badgeWidthExtra = 12
  } else if (count > 9) {
    badgeWidthExtra = 6
  }

  const badgeWidth = 26
  const totalBadgeWidth = badgeWidth + badgeWidthExtra

  // positioning
  const rectX = x + 4
  const textX = rectX + totalBadgeWidth / 2

  // negative y is "higher"
  // positive y is "lower"
  const badgeHeight = 22
  const rectY = y - badgeHeight - 6
  const textY = y - badgeHeight + 10

  return (
    <>
      <rect
        x={rectX}
        y={rectY}
        rx={badgeHeight / 2}
        ry={badgeHeight / 2}
        width={totalBadgeWidth}
        height={badgeHeight}
        className={clsx(classes.badgeRect)}
      />
      <text
        x={textX}
        y={textY}
        fontSize={14}
        className={clsx(classes.badgeText)}
        textAnchor='middle'
      >
        {displayCount}
      </text>
    </>
  )
}

export default BadgeResults
