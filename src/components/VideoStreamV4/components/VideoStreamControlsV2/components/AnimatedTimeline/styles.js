import { makeStyles } from '@material-ui/core/styles'

// import { TIMELINE } from '../../constants'

const useStyles = makeStyles(theme => ({
  controlsRoot: {
    // bottom: TIMELINE.controls.height,
    // height: TIMELINE.container.height,
    // left: 0,
    // position: 'absolute',
    // width: '100%',
    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility .5s, opacity .5s',
  },
  userActive: {
    opacity: 1,
    visibility: 'visible',
    transition: 'visibility .5s, opacity .5s',
  },
}))

export default useStyles
