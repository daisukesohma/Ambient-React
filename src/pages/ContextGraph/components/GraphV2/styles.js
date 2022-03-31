import { makeStyles } from '@material-ui/core/styles'

const activeOpacity = 1
const hoverOpacity = 0.7
const showAllOpacity = 0.2
const passiveOpacity = 0.3
const animationSpeed = 'r 0.5s'

export default makeStyles(({ palette }) => ({
  root: {
    // background: palette.common.black,
    boxSizing: 'border-box',
    height: 'calc(100% - 80px)',
    width: '100%',
  },
  svgBasis: {
    // backgroundColor: palette.common.black,
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
  },
  lineStyles: {
    stroke: 'transparent',
    opacity: passiveOpacity,
    transition: 'opacity .3s, stroke .3s',
    '&.showEdges': {
      opacity: showAllOpacity,
      stroke: palette.common.tertiary,
    },
    '&.showEdges.isHovered': {
      opacity: hoverOpacity,
      stroke: palette.common.greenBluePastel,
    },
    '&.active': {
      opacity: activeOpacity,
      stroke: palette.common.greenPastel,
    },
    '&.isHovered': {
      opacity: hoverOpacity,
      stroke: palette.common.tertiary,
    },
    '&.active.isHovered': {
      stroke: palette.common.greenPastel,
    },
  },

  threatSignature: {
    cursor: 'pointer',
    fill: palette.primary[100],
    r: 7.5,
    transition: animationSpeed,
    '&.passive': {
      opacity: passiveOpacity,
    },
    '&.hover': {
      opacity: activeOpacity,
      transition: animationSpeed,
      r: 11,
    },
    '&.active': {
      opacity: activeOpacity,
      fill: palette.error.main,
      transition: animationSpeed,
      r: 11,
    },
  },

  threatSignatureText: {
    opacity: activeOpacity,
    fill: palette.text.primary,
  },

  region: {
    fill: palette.common.tertiary,
    r: 15,
    transition: animationSpeed,
    cursor: 'pointer',
    '&.passive': {
      opacity: passiveOpacity,
    },
    '&.hover': {
      r: 20,
      transition: animationSpeed,
      opacity: activeOpacity,
    },
    '&.active': {
      opacity: activeOpacity,
      fill: palette.error.main,
    },
  },

  regionText: {
    fill: palette.text.primary,
    '&.passive': {
      opacity: passiveOpacity,
    },
    '&.hover': {
      opacity: activeOpacity,
    },
    '&.active': {
      opacity: activeOpacity,
    },
  },
  edgeText: {
    // color: palette.grey[700],
  },
}))
