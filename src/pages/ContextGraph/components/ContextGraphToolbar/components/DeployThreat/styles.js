import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  leftAdornmentAction: {
    marginLeft: spacing(2),
    marginRight: spacing(1),
    // color: palette.grey[700],
    '&:hover': {
      color: palette.primary.main,
    },
  },
}))
