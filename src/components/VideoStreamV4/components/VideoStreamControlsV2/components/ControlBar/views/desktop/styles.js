import { makeStyles } from '@material-ui/core/styles'

import { TIMELINE } from '../../../../constants'

const animationSpeed = 'opacity .25s, transform .25s'

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  iconButtonRoot: {
    transition: 'background 10ms cubic-bezier(1,0,0,1) 0ms',
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
  leftGroup: {
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  liveRecordedGroup: {
    margin: theme.spacing(0, 2, 0, 1),
    maxWidth: 160,
  },
  rightMargin: {
    marginRight: theme.spacing(2),
  },
  sliderGroup: {
    minWidth: 160,
    maxWidth: '92%',
  },
  timerGroup: {
    maxWidth: 'fit-content',
    margin: theme.spacing(0, 2, 0, 0),
  },
  calendarGroup: {
    maxWidth: 24,
    margin: theme.spacing(0, 0.5),
  },
  playSpeedSlider: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(2),
  },
  timeRangeWrapper: {
    position: 'absolute',
    bottom: TIMELINE.controls.height,
    width: '100%',
  },
}))

export default useStyles
