import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    padding: spacing(0.25, 1),
    borderRadius: 20,
    color: palette.common.white,
  },
}))
