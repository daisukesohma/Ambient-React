import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
