import { makeStyles } from '@material-ui/core/styles'

const activeOpacity = 1
const passiveOpacity = 0.15
const animationSpeed = 'r 0.2s, opacity .2s, fill .4s, transform .2s'
const smallNode = 8
const bigNode = 10
const MULTIPLICATION_FACTOR = 1.2

export default makeStyles(({ palette }) => ({
  activeIndicator: ({ isActive }) => ({
    cursor: 'pointer',
    r: 4,
    fill: isActive ? palette.common.greenPastel : palette.error.main,
  }),
  node: ({
    hasResults,
    hasSelected,
    isSelected,
    centerX,
    centerY,
    cx,
    cy,
    cxMultiplier,
    cyMultiplier,
  }) => ({
    cursor: 'pointer',
    fill: isSelected ? 'rgb(220, 0, 78)' : palette.common.tertiary,
    opacity: hasResults || isSelected ? 1 : 0.5,
    r: smallNode,
    transition: animationSpeed,
    transform: (() => {
      if (hasResults && hasSelected) {
        if (isSelected) {
          return `translate(${centerX - cx}px, ${centerY - cy}px)`
        }
        return `translate(${cxMultiplier(MULTIPLICATION_FACTOR) -
          cx}px, ${cyMultiplier(MULTIPLICATION_FACTOR) - cy}px)`
      }
      return 'translateY(0)'
    })(),
    transformOrigin: `${cx}px ${cy}px`,
    '&.hasHovered': {
      opacity: passiveOpacity,
    },
    '&.hasResults': {
      r: bigNode,
      opacity: hasResults ? 0.5 : 0,
    },
    '&.isSelected': {
      opacity: '1 !important',
    },
    '&.hasResults.isActive': {
      opacity: hasResults ? 1 : 0,
    },
    '&.isResultsEmpty': {
      opacity: 0.1,
    },
    '&.hasActive': {
      opacity: passiveOpacity,
    },
    '&.hasHovered.isHovered': {
      r: bigNode,
      transition: animationSpeed,
      opacity: activeOpacity,
    },
    '&.hasActive.isActive': {
      r: bigNode,
      opacity: activeOpacity,
    },
    '&.hasActive.isActive.isResultsEmpty': {
      r: bigNode,
      opacity: 0.1,
    },
  }),
  // clickable / isHoverable container
  textContainer: {
    transform: 'translateY(-20px)', // offset the 20px height
    fillOpacity: 0, // make it invisible
  },
  text: ({
    xText,
    yText,
    hasResults,
    isSelected,
    hasSelected,
    cx,
    cy,
    cxMultiplier,
    cyMultiplier,
  }) => ({
    // fill: 'white',
    fill: palette.text.primary,
    opacity: hasResults || isSelected ? 1 : 0.1,
    transform: (() => {
      if (hasResults && hasSelected && !isSelected) {
        return `translate(${cxMultiplier(MULTIPLICATION_FACTOR) -
          cx}px, ${cyMultiplier(MULTIPLICATION_FACTOR) - cy}px)`
      }
      return 'translateY(0)'
    })(),
    transformOrigin: `${xText}px ${yText}px`,
    transition: 'opacity .3s, transform .3s',
    '&.hasActive': {
      opacity: 0,
    },
    '&.hasActive.hasHovered': {
      opacity: 0.2,
    },
    '&.hasResults': {
      opacity: hasResults ? 0.5 : 0,
    },
    '&.isSelected': {
      opacity: '1 !important',
    },
    '&.hasResults.isActive': {
      opacity: hasResults ? 1 : 0,
    },
    '&.hasHovered': {
      opacity: 0,
      transform: 'translateY(-8px)',
    },
    '&.hasHovered.hasResults': {
      opacity: 0.1,
    },
    '&.hasHovered.isHovered': {
      opacity: activeOpacity,
      transform: 'rotate(0deg)',
      cursor: 'pointer',
    },
    '&.hasActive.isActive': {
      opacity: activeOpacity,
    },
    '&.isResultsEmpty': {
      opacity: 0.2,
    },
    '&.hasActive.isActive.isResultsEmpty': {
      opacity: 0.2,
    },
  }),
  textCaption: ({
    hasResults,
    isSelected,
    hasSelected,
    cx,
    cy,
    cxMultiplier,
    cyMultiplier,
  }) => ({
    opacity: hasResults ? 1 : 0,
    transform: (() => {
      if (hasResults && hasSelected && !isSelected) {
        return `translate(${cxMultiplier(MULTIPLICATION_FACTOR) -
          cx}px, ${cyMultiplier(MULTIPLICATION_FACTOR) - cy}px)`
      }
      return 'translateY(0)'
    })(),
    fill: palette.text.primary,
    '&.hasResults': {
      opacity: hasResults ? 0.5 : 0,
    },
    '&.hasResults.isActive': {
      opacity: hasResults ? 1 : 0,
    },
    '&.isResultsEmpty': {
      opacity: 0.2,
    },
    '&.hasHovered.hasResults': {
      opacity: 0.1,
    },
  }),
  streamCountText: ({
    hasResults,
    isSelected,
    hasSelected,
    cx,
    cy,
    cxMultiplier,
    cyMultiplier,
  }) => ({
    opacity: hasResults ? 1 : 0,
    fill: palette.text.primary,
    '&.isResultsEmpty': {
      opacity: 0.2,
    },
    transform: (() => {
      if (hasResults && hasSelected && !isSelected) {
        return `translate(${cxMultiplier(MULTIPLICATION_FACTOR) -
          cx}px, ${cyMultiplier(MULTIPLICATION_FACTOR) - cy}px)`
      }
      return 'translateY(0)'
    })(),
  }),
}))
