import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: ({ darkMode }) => ({
    color: theme.palette.grey[darkMode ? 200 : 700],
  }),
  description: ({ darkMode }) => ({
    color: theme.palette.grey[darkMode ? 200 : 700],
  }),
}))
