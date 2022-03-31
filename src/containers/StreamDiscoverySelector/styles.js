import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexWrap: 'nowrap',
    width: '100%',
    height: '100vh',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  toolbar: {
    margin: theme.spacing(0, 0, 3, 0),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100,
  },
}))

export default useStyles
