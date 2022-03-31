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

  link: ({ darkMode }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    color: darkMode ? theme.palette.common.white : theme.palette.common.black,
    textDecoration: 'none',
  }),

  listItemContainer: ({ onFolderTree }) => ({
    cursor: 'pointer',
    paddingLeft: onFolderTree ? 0 : theme.spacing(3),
  }),

  listItemRoot: {
    paddingLeft: theme.spacing(4.25),
  },

  textFieldRoot: ({ darkMode }) => ({
    '&&': {
      color: darkMode ? theme.palette.common.white : theme.palette.grey[800],
    },
  }),

  lockIconContainer: {
    position: 'absolute',
    top: '50%',
    left: 6,
    transform: 'translateY(-50%)',
  },
}))
