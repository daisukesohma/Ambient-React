import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  gridRoot: ({ darkMode }) => ({
    padding: theme.spacing(3),
    maxWidth: 320,
    background: darkMode ? theme.palette.grey[900] : theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[darkMode ? 700 : 300]}`,
  }),
  ConfirmBtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  confirmTitle: ({ darkMode }) => ({
    marginBottom: theme.spacing(3),
    textAlign: 'left',
    fontSize: 16,
    color: darkMode ? theme.palette.common.white : theme.palette.grey[900],
  }),
  buttonLeft: {
    marginRight: theme.spacing(2),
  },
}))
