import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  actionBar: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(4, 0, 2, -1),
    paddingBottom: theme.spacing(2),
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(3),
  },
  selectText: {
    color: theme.palette.grey[500],
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 100,
  },
}))
