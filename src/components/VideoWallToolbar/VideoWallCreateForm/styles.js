import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    float: 'right',
    cursor: 'pointer',
  },
  inputRoot: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[300] : theme.palette.common.black,
    maxWidth: '665px',
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  }),
  textField: ({ darkMode }) => ({
    marginRight: theme.spacing(1),
    width: '100%',
    color: darkMode ? theme.palette.common.white : theme.palette.common.black,
  }),
  inputUnderline: ({ darkMode }) => ({
    '&:before': {
      borderBottom: `1px solid ${theme.palette.grey[darkMode ? 600 : 300]}`,
    },
  }),
  inputLabelRoot: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[300] : theme.palette.common.black,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }),
  formControlLabel: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[300] : theme.palette.common.black,
  }),
  checkboxRoot: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[300] : theme.palette.common.black,
    marginLeft: theme.spacing(1),
  }),
}))
