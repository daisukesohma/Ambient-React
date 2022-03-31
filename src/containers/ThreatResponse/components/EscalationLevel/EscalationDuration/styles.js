import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  durationTextContainer: ({ activeEdit }) => ({
    display: 'flex',
    flexDirection: activeEdit ? 'column' : 'row',
  }),
  timeout: {
    marginTop: theme.spacing(2),
  },
  durationInput: {
    // color: theme.palette.grey[700],
    maxWidth: 40,
    marginRight: theme.spacing(1),
  },
  durationLabel: {
    marginRight: theme.spacing(2),
  },
  root: {
    margin: theme.spacing(2, 0),
  },
  buttonContainer: {
    marginTop: 3,
    marginLeft: theme.spacing(4),
  },
}))
