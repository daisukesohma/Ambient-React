import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode, isMobileOnly }) => ({
    width: isMobileOnly ? '100%' : 600,
    padding: spacing(1),
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
    border: `1px solid ${darkMode ? palette.grey[800] : palette.grey[50]}`,
    borderRadius: spacing(0.5),
  }),
  title: ({ darkMode }) => ({
    color: darkMode ? palette.grey[50] : palette.grey[800],
  }),
  relativeRange: ({ darkMode }) => ({
    borderLeft: '1px solid',
    borderColor: darkMode ? palette.grey[50] : palette.grey[800],
  }),
  apply: {
    marginTop: 16,
    marginLeft: 20,
  },
}))
