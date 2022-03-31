import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  saveButton: {
    marginRight: '16px',
  },
  title: {
    marginRight: '16px',
  },
  text: {
    color: theme.palette.grey[700],
  },
  textSpacing: {
    margin: theme.spacing(0, 2),
  },
  subTextColor: {
    color: theme.palette.grey[500],
  },
}))
