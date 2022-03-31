import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    color: palette.text.primary,
  },
  checked: {
    color: palette.common.buttonBlue,
  },
}))
