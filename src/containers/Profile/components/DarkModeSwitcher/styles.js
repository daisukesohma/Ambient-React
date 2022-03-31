import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: spacing(0.5),
    marginBottom: spacing(3),
    padding: spacing(3),
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
  }),
  themeRoot: {
    padding: spacing(2, 3),
  },
  themeTitle: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : null,
    marginBottom: spacing(1),
  }),
  themeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))
