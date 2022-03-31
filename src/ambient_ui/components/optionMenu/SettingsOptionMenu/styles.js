import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  iconContainer: ({ darkMode }) => ({
    marginTop: -spacing(0.5),
    color: darkMode ? palette.common.white : palette.grey[700],
    '&:hover': {
      color: palette.primary.main,
    },
  }),
}))
