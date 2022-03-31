import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 100 : 700],
  }),
}))
