import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  icon: {
    marginTop: spacing(1),
  },
  regionContainer: {
    padding: spacing(0.5, 0, 0.5, 0.5),
    // color: palette.grey[50],
    borderRadius: spacing(0.5),
  },
}))
