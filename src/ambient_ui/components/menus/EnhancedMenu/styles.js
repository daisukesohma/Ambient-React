import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  selected: ({ darkMode }) => ({
    background: `${darkMode ? palette.grey[700] : palette.grey[50]} !important`,
    fontWeight: '900 !important',
  }),
  menuItem: ({ darkMode }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    background: darkMode ? palette.grey[900] : palette.grey[50],
    borderTop: `1px solid ${darkMode ? palette.grey[800] : palette.grey[100]}`,
    borderBottom: `1px solid ${
      darkMode ? palette.grey[800] : palette.grey[100]
    }`,
    fontSize: 14,
    color: darkMode ? palette.grey[400] : palette.grey[700],
    fontWeight: 300,
    minWidth: 170,
    '&:hover': {
      background: darkMode ? palette.grey[800] : palette.grey[50],
      fontWeight: '900',
    },
    '&:last-child': {
      borderBottom: `2px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
    },
    '&:first-of-type': {
      borderTop: `2px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
    },
  }),
  dividerText: ({ darkMode }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    background: darkMode ? palette.grey[900] : palette.grey[50],
    borderTop: `1px solid ${darkMode ? palette.grey[800] : palette.grey[100]}`,
    borderBottom: `1px solid ${
      darkMode ? palette.grey[800] : palette.grey[100]
    }`,
    fontSize: 12,
    color: darkMode ? palette.grey[400] : palette.grey[700],
    fontWeight: 300,
    minWidth: 170,
    cursor: 'default',
    height: 20,
    '&:hover': {
      background: darkMode ? palette.grey[800] : palette.grey[50],
    },
    '&:last-child': {
      borderBottom: `2px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
    },
    '&:first-of-type': {
      borderTop: `2px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
    },
  }),

  dropdownStyle: ({ width }) => ({
    boxShadow: 'unset',
    marginTop: '-1px',
    width,
  }),
  menuList: {
    padding: 0,
  },
}))
