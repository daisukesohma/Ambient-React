import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  compareIncrease: {
    backgroundColor: palette.common.greenBluePastel,
    color: palette.common.white,
  },
  compareDecrease: {
    backgroundColor: palette.error.main,
    color: palette.common.white,
  },
}))
