import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  formControl: {
    minWidth: 250,
    maxWidth: 250,
  },
  InputLabel: {
    color: palette.grey[500],
  },
  select: {
    '&:before': {
      borderColor: palette.primary.light,
    },
    '&:after': {
      borderColor: palette.primary.light,
    },
  },
  icon: {
    fill: palette.primary.light,
  },
}))
