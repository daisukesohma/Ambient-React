import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  baseText: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[700],
  }),
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: spacing(0.5),
    marginTop: spacing(0.5),
  },
  tooltipRoot: { padding: 8 },
  rowText: { color: palette.grey[700] },
  tooltipText: { color: palette.grey[500] },
}))
