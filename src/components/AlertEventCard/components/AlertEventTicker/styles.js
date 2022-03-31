import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  tickerText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
  },
}))
