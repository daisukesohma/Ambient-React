import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  paper: ({ darkMode }) => ({
    '&&': {
      backgroundColor: darkMode ? palette.common.black : palette.common.white,
      color: darkMode ? palette.common.white : palette.common.black,
    },
  }),
  tabRoot: {
    minWidth: spacing(12),
    minHeight: spacing(6),
    textTransform: 'none',
    fontWeight: 400,
    '&:hover': {
      color: palette.primary[300],
      opacity: 1,
    },
  },
  tabWrapper: {
    padding: spacing(0, 0.5),
  },
}))
