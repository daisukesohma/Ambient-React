import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  container: ({ darkMode }) => ({
    padding: 20,
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  textFieldRoot: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.grey[800],
    '& .MuiInput-input': {
      color: darkMode ? palette.common.white : palette.grey[800],
    },
    '& label': {
      color: darkMode ? palette.common.white : palette.grey[800],
    },
    '& label.Mui-focused': {
      color: darkMode ? palette.common.white : palette.grey[800],
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: darkMode ? palette.common.white : palette.grey[800],
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: darkMode ? palette.common.white : palette.grey[800],
    },
  }),
  label: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.grey[800],
    marginLeft: 8,
    marginBottom: 4,
  }),
}))
