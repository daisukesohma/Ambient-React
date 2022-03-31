import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  modal: ({ darkMode }) => ({
    position: 'absolute',
    width: '25%',
    minWidth: 600,
    left: '30%',
    top: '10%',
    // background: darkMode ? palette.grey[900] : palette.common.white,
    padding: spacing(3),
    border: `1px solid ${palette.grey[700]}`,
  }),
  subtitleText: ({ darkMode }) => ({
    // color: darkMode ? palette.grey[600] : palette.grey[700],
  }),
  title: ({ darkMode }) => ({
    // color: darkMode ? palette.grey[400] : palette.grey[700],
  }),
  inputText: ({ darkMode }) => ({
    // color: `${darkMode ? palette.grey[400] : palette.grey[700]} !important`,
  }),
  checkboxRoot: {
    // color: palette.secondary[200],
  },
  checkboxLabelText: ({ darkMode }) => ({
    // color: `${darkMode ? palette.grey[300] : palette.grey[700]} !important`,
  }),
}))
