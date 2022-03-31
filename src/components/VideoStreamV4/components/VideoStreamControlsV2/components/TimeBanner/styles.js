import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    bottom: 12,
    color: palette.primary[500],
  },
  tooltipRoot: {
    padding: spacing(0.5),
  },
}))
