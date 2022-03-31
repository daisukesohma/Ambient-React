import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  statusContainer: {
    height: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  statusText: {
    color: theme.palette.grey[700],
  },
  statusTextItem: {
    marginRight: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))
