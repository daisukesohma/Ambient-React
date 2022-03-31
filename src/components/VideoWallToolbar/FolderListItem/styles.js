import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
    cursor: 'pointer',
  },

  selectedWhite: {
    backgroundColor: `${theme.palette.primary[50]} !important`,
  },

  selectedBlack: {
    backgroundColor: `${theme.palette.grey[800]} !important`,
  },

  popoverWhite: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.common.black,
  },

  popoverBlack: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
  },

  link: {
    width: '100%',
    color: theme.palette.common.black,
    textDecoration: 'none',
  },
  listItemContainer: {
    cursor: 'pointer',
  },
  listActionContainer: {
    '&&': {
      right: 0,
    },
  },
  listItemRoot: {
    paddingLeft: theme.spacing(0.5),
  },

  textFieldRoot: ({ darkMode }) => ({
    '&&': {
      color: darkMode ? theme.palette.common.white : theme.palette.grey[800],
    },
  }),
}))
