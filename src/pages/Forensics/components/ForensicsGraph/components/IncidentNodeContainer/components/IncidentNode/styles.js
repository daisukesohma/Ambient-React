import { makeStyles } from '@material-ui/core/styles'

const activeOpacity = 1

export default makeStyles(({ palette }) => ({
  text: ({ xText, yText, hasResults }) => ({
    fill: palette.text.primary,
    opacity: hasResults ? 1 : 0.1,
    transform: 'translateY(0px)',
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
