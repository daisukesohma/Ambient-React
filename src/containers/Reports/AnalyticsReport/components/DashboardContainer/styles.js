import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  textColor: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  cell: ({ darkMode }) => ({
    height: 'calc(100% - 16px)',
    margin: 5,
    backgroundColor: darkMode ? palette.grey[700] : palette.common.white,
  }),
  alertPanel: {
    padding: spacing(0, 1),
    margin: spacing(1, 0),
  },
}))
