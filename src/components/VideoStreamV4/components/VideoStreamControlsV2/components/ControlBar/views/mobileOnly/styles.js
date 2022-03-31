import { makeStyles } from '@material-ui/core/styles'

const animationSpeed = 'opacity .25s, transform .25s'

const useStyles = makeStyles(theme => ({
  fullScreenRoot: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'relative',
    width: '100%',
  },
  invisible: {
    marginTop: 2,
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
  playSpeedContainerBase: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 16,
  },
  playSpeedContainerPortrait: {
    position: 'absolute',
    bottom: 120,
    right: 0,
  },
}))

export default useStyles
