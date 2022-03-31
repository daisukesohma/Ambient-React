import { makeStyles } from '@material-ui/core/styles'

const activeOpacity = 1
const passiveOpacity = 0.15
const animationSpeed = 'r 0.3s, opacity .3s, fill 1s'

export default makeStyles(({ palette }) => ({
  node: {
    fill: palette.secondary.main,
    opacity: 0.4,
    r: 12,
    transition: animationSpeed,
    cursor: 'pointer',
    '&.hasHovered': {
      opacity: passiveOpacity,
    },
    '&.hasActive': {
      opacity: passiveOpacity,
    },
    '&.hasHovered.isHovered': {
      r: 14,
      opacity: activeOpacity,
    },
    '&.hasActive.isActive': {
      opacity: activeOpacity,
      r: 14,
    },
  },

  text: {
    fill: palette.text.primary,
    transition: 'opacity .15s',
    opacity: 0.35,
    '&.hasActive': {
      opacity: passiveOpacity,
    },
    '&.hasHovered': {
      opacity: 0,
    },
    '&.hasHovered.isHovered': {
      opacity: activeOpacity,
    },
    '&.hasActive.isActive': {
      opacity: activeOpacity,
    },
  },
  statusBall: {
    r: 3,
    fill: palette.error.light,
    '&.isStatusActive': {
      fill: palette.common.greenPastel,
    },
  },
  subtext: {
    fill: palette.grey[500],
    fontSize: 10,
    transition: 'opacity .15s',
    opacity: 0.35,
    '&.hasActive': {
      opacity: passiveOpacity,
    },
    '&.hasHovered': {
      opacity: 0,
    },
    '&.hasHovered.isHovered': {
      opacity: activeOpacity,
    },
    '&.hasActive.isActive': {
      opacity: activeOpacity,
    },
  },
}))
