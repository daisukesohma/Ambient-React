import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    marginTop: '20%',
  },
  logo: {
    width: 88,
  },
  logoutRootBlock: {
    textAlign: 'center',
  },
  loading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
  progressBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
}))

export default useStyles
