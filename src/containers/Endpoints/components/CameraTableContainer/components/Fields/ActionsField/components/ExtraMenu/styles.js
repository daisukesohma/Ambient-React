import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  icon: ({ darkMode }) => ({
    color: darkMode ? palette.grey[100] : palette.grey[700],
  }),
}))
