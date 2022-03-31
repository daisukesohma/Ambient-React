import { makeStyles } from '@material-ui/core/styles'

const animationSpeed = 'opacity .25s, transform .25s'

export default makeStyles(({ spacing, palette }) => ({
  playButton: {
    margin: spacing(0, 0.5),
  },

  frameButtons: ({ isPlaying }) => ({
    color: palette.primary[500],
    visibility: isPlaying ? 'hidden' : 'visible',
    opacity: isPlaying ? 0 : 1,
  }),

  invisible: {
    opacity: 0,
    transform: 'translate(0px, -16px)',
    transition: animationSpeed,
    transitionTimingFunction: 'ease-in',
    overflow: 'hidden',
    '&.fadeIn': {
      opacity: 1,
      transform: 'translate(0px, 0px)',
      transition: animationSpeed,
      transitionTimingFunction: 'ease-out',
      overflow: 'hidden',
    },
  },
}))
