import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: spacing(0.5),
    marginBottom: spacing(3),
    padding: spacing(2, 3),
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
  }),
  notificationContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing(1),
  },
  notificationTitle: ({ darkMode }) => ({
    marginBottom: spacing(2),
    color: darkMode ? palette.grey[300] : null,
  }),
  labelText: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 300 : 500],
  }),
  labelSelected: {
    color: palette.primary.main,
  },
}))
