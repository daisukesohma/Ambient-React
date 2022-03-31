import { makeStyles } from '@material-ui/core/styles'

const activeOpacity = 1

export default makeStyles(({ palette }) => ({
  node: ({ hasResults }) => ({
    opacity: hasResults ? 1 : 0.1,
    cursor: hasResults ? 'pointer' : 'not-allowed',
    '&.isHovered': {
      fill: palette.primary.main,
    },
  }),
  text: ({ xText, yText, hasResults }) => ({
    fill: palette.grey[500],
    opacity: hasResults ? 1 : 0.2,
    transform: 'translateY(0px)',
    transformOrigin: `${xText}px ${yText}px`,
    transition: 'opacity .3s, transform .3s',
    '&.isHovered': {
      fill: palette.secondary.main,
    },
    '&.isActive': {
      fill: palette.secondary.main,
    },
    // OLD ARE THESE BEING USED?
    '&.hasActive': {
      opacity: 0,
    },
    '&.hasActive.hasHovered': {
      opacity: 0.2,
    },
    '&.hasResults': {
      opacity: hasResults ? 1 : 0,
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
}))
