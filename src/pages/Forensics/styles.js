import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    position: 'relative',
    height: '100%',
    overflow: 'auto',
    width: '100%',
    background: palette.background.levels[1],
  },
  loadingProgress: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  maxHeight: {
    height: 'calc(100% - 32px)',
  },
  blackBackground: {
    background: palette.background.levels[1],
  },
  searchRecommendation: {
    textAlign: 'center',
  },
  mainContainer: {
    width: 'calc(100vw - 50px)',
    height: 'calc(100% - 82px)',
    justifyContent: 'space-between',
  },
  leftContainer: {
    width: '100%',
  },
  rightContainer: {
    minWidth: spacing(34),
    maxWidth: spacing(60),
    width: '100%',
  },
}))
