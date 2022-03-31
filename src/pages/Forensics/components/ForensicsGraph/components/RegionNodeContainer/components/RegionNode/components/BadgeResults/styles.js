import { makeStyles } from '@material-ui/core/styles'

const MULTIPLICATION_FACTOR = 1.2

export default makeStyles(({ palette }) => ({
  badgeRect: ({
    isActive,
    hasResults,
    hasSelected,
    isSelected,
    selectedX,
    selectedY,
    cxMultiplier,
    cyMultiplier,
    x,
    y,
  }) => ({
    fill: isActive ? palette.error.main : palette.common.tertiary, // mui badge color.
    fillOpacity: isActive ? 0.5 : 0.3,
    stroke: palette.secondary[100],
    strokeOpacity: isActive ? 0.4 : 0.1,
    transition: 'transform .2s',
    transform: (() => {
      if (hasResults && hasSelected) {
        if (isSelected) {
          return `translate(${selectedX}px, ${selectedY}px)`
        }
        return `translate(${cxMultiplier(MULTIPLICATION_FACTOR) -
          x}px, ${cyMultiplier(MULTIPLICATION_FACTOR) - y}px)`
      }
      return 'translateY(0)'
    })(),
  }),
  badgeText: ({
    isActive,
    hasResults,
    hasSelected,
    isSelected,
    selectedX,
    selectedY,
    cxMultiplier,
    cyMultiplier,
    x,
    y,
  }) => ({
    fill: palette.primary.contrastText,
    fillOpacity: isActive ? 1 : 0.5,
    transition: 'transform .2s',
    transform: (() => {
      if (hasResults && hasSelected) {
        if (isSelected) {
          return `translate(${selectedX}px, ${selectedY}px)`
        }
        return `translate(${cxMultiplier(MULTIPLICATION_FACTOR) -
          x}px, ${cyMultiplier(MULTIPLICATION_FACTOR) - y}px)`
      }
      return 'translateY(0)'
    })(),
  }),
}))
