import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    padding: spacing(1, 1.5),
    color: palette.secondary.main,
  },
}))
