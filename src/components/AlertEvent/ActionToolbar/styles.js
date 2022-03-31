import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  button: {
    // cursor: 'pointer',
    padding: 0,
  },
  bookmark: {
    paddingTop: theme.spacing(0.5),
  },
}))
