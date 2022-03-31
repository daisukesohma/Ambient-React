import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  textColor: ({ darkMode }) =>
    darkMode ? palette.common.white : palette.common.black,
}))
