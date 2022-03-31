import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  title: {
    margin: theme.spacing(2),
    textAlign: 'left',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(2),
  },
}))
