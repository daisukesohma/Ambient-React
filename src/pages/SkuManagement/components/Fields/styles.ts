import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  statusGreen: {
    color: palette.common.greenPastel,
  },
  statusYellow: {
    color: palette.warning.main,
  },
  statusRed: {
    color: palette.error.main,
  },
}))
