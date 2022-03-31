import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
  },
  loadingProgress: { width: '100%', position: 'absolute', top: 0 },
  maxHeight: { height: '100%' },
  blackBackground: {
    // background: palette.common.black,
  },
}))
