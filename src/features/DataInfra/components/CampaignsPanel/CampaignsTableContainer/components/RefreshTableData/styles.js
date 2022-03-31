import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  icon: {
    color: palette.grey[500],
    marginRight: spacing(2),
    '&:hover': {
      color: palette.primary[300],
    },
  },
  iconWrapper: {
    marginTop: -3,
  },
}))
