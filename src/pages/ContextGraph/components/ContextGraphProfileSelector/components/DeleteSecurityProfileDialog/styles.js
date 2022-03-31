import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  warningText: {
    marginTop: spacing(2),
    color: palette.error.main,
  },
  subText: {
    marginTop: spacing(2),
  },
}))
