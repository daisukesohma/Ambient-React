import { makeStyles } from '@material-ui/core/styles'

import {
  FILMSTRIP_HEIGHT,
  TOOLTIP_ABOVE_FILMSTRIP,
  TIMELINES_CHART_HEIGHT,
} from '../constants'

const useStyles = makeStyles(theme => ({
  timelineRoot: {
    // background: 'rgba(255,255,255,.15)',
    bottom: 50,
    height: 8,
    left: 0,
    opacity: 0,
    position: 'absolute',
    width: '100%',
    visibility: 'hidden',
    // transition: 'visibility .5s, opacity .5s' // TESTING
  },
  userActive: {
    opacity: 1,
    visibility: 'visible',
    // transition: 'visibility .5s, opacity .5s' // TESTING
  },

  // NEW
  timelineNewRoot: {
    position: 'absolute',
    height: 8,
    marginBottom: 10,
    top: 0,
  },
  filmstrip: {
    position: 'absolute',
    top: -(FILMSTRIP_HEIGHT + theme.spacing(1)),
    paddingBottom: theme.spacing(1),
  },
  progress: {
    appearance: 'none',
    borderRadius: 2,
    width: '100vw',
    height: 8,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
  },
  seek: {
    position: 'absolute',
    top: 0,
    width: '100vw',
    cursor: 'pointer',
    margin: 0,
    height: 8,
  },
  timelinesChart: {
    position: 'absolute',
    top: -(TIMELINES_CHART_HEIGHT + FILMSTRIP_HEIGHT + theme.spacing(1)),
    paddingBottom: theme.spacing(1),
  },
  tooltip: {
    display: 'none',
    position: 'absolute',
    top: -(FILMSTRIP_HEIGHT + TOOLTIP_ABOVE_FILMSTRIP + theme.spacing(1)),
    padding: 3,
    color: '#fff',
    height: 16,
    background: 'rgba(0, 0, 0, 0.6)',
  },
}))

export default useStyles
