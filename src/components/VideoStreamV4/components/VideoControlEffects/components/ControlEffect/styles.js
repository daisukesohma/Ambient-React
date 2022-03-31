import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ transitions, palette }) => ({
  '@keyframes controlEffect': {
    '0%': {
      opacity: 1,
      transform: 'translate(-50%, -50%), scale(0.8)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(-50%, -50%), scale(1.5)',
    },
  },
  '@keyframes iconEffect': {
    '0%': {
      opacity: 0.7,
      transform: 'scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1.5)',
    },
  },
  ControlEffectWrapper: {
    animation: `$controlEffect .7s ${transitions.easing.easeInOut}`,
    animationFillMode: 'forwards',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  IconWrapper: {
    animation: `$iconEffect .7s ${transitions.easing.easeInOut}`,
    animationFillMode: 'forwards',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: palette.grey[900],
    borderRadius: '50%',
  },
}))
