import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  titleContainer: ({ darkMode }) => ({
    marginBottom: spacing(4),
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
