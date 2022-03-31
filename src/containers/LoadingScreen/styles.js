import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: {
    background: palette.background.paper,
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    marginTop: 0,
    paddingTop: '20%',
  },
  logo: {
    width: 88,
    height: 88,
  },
  logoutRootBlock: {
    textAlign: 'center',
  },
  loading: {
    marginTop: spacing(1),
    marginBottom: spacing(2),
  },
  progress: {
    marginLeft: spacing(1),
  },
  progressBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
}))
