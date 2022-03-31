import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  textField: ({ darkMode }) => ({
    marginRight: spacing(1),
    width: '100%',
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  container: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: spacing(0.5),
    marginBottom: spacing(3),
    padding: spacing(3),
  }),
  menuItem: {
    '&&': {
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: spacing(2),
    },
  },
  column: {
    paddingRight: spacing(1),
  },
  inputRoot: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  inputUnderline: ({ darkMode }) => ({
    '&:before': {
      borderBottom: `1px solid ${palette.grey[darkMode ? 600 : 300]}`,
    },
  }),
  inputUnderlineDark: {
    '&:before': {
      borderBottom: `1px solid ${palette.grey[600]}`,
    },
  },
  inputLabelRoot: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  inputLabelDisabledDark: {
    color: `${palette.grey[300]} !important`,
  },
  formHelperRoot: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 500 : 700],
  }),
  formHelperDisabledDark: {
    color: `${palette.grey[500]} !important`,
  },
  selectRoot: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  formControlLabel: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  checkboxRoot: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
}))
