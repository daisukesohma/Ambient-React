import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  label: ({ darkMode }) => ({
    color: theme.palette.grey[darkMode ? 300 : 400],
  }),
  value: ({ darkMode }) => ({
    color: theme.palette.grey[darkMode ? 200 : 700],
  }),
}))
