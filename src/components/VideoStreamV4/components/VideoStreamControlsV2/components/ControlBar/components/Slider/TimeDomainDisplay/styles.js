import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  current: {
    color: palette.grey[600],
  },
  speed: {
    color: palette.primary[500],
    marginLeft: spacing(1),
    padding: spacing(0.5),
    width: spacing(5.5),
    borderRadius: spacing(0.5),
  },
}))
