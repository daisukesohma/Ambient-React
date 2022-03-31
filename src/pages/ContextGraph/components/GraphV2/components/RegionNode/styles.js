import { makeStyles } from '@material-ui/core/styles'

const activeOpacity = 1
const passiveOpacity = 0.15
const animationSpeed = 'r 0.3s, opacity .3s, fill .6s'

export default makeStyles(({ palette }) => ({
  node: {
    cursor: 'pointer',
    fill: palette.common.tertiary,
    opacity: 0.4,
    r: 16,
    transition: animationSpeed,
    '&.hasHovered': {
      opacity: passiveOpacity,
    },
    '&.hasActive': {
      opacity: passiveOpacity,
    },
    '&.hasHovered.isHovered': {
      r: 18,
      transition: animationSpeed,
      opacity: activeOpacity,
    },
    '&.hasActive.isActive': {
      r: 18,
      opacity: activeOpacity,
    },
  },
  // clickable / isHoverableed container
  textContainer: {
    transform: 'translateY(-20px)', // offset the 20px height
    fillOpacity: 0, // make it invisible
  },
  text: ({ xText, yText }) => ({
    fill: palette.text.primary,
    opacity: 0.35,
    transform: 'translateY(0px)',
    transformOrigin: `${xText}px ${yText}px`,
    transition: 'opacity .3s, transform .3s',
    '&.hasActive': {
      opacity: passiveOpacity,
    },
    '&.hasHovered': {
      opacity: 0,
      transform: 'translateY(-8px)',
    },
    '&.hasHovered.isHovered': {
      opacity: activeOpacity,
      transform: 'rotate(0deg)',
    },
    '&.hasActive.isActive': {
      opacity: activeOpacity,
    },
  }),
}))
