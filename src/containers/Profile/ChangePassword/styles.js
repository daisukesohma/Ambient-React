import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
    },
    '& .MuiFormControlLabel-root': {
      marginLeft: 0,
    },
  },
  flexItem: {
    display: 'flex',
  },
  container: ({ darkMode }) => ({
    background: darkMode ? palette.grey[800] : palette.common.white,
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    marginBottom: '24px',
    padding: 24,
  }),
  cancelBtn: {
    marginRight: '8px !important',
  },
  btnContainer: {
    justifyContent: 'flex-end',
    display: 'flex',
  },
  title: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : null,
  }),
  formHelperRoot: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 500 : 700],
  }),
  inputRoot: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 300 : 700],
  }),
  inputUnderline: ({ darkMode }) => ({
    '&:before': {
      borderBottom: `1px solid ${palette.grey[darkMode ? 600 : 300]}`,
    },
  }),
  inputLabelRoot: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 400 : 700],
  }),
}))
