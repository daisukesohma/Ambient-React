import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  streamNumber: {
    background: 'transparent',
    position: 'absolute',
    bottom: 51 + 8,
    left: 16 + 8,
  },
  footerText: {
    color: theme.palette.grey[700],
  },
  boldText: {
    color: theme.palette.common.tertiary,
  },
  hoverText: {
    color: theme.palette.primary.main,
  },
}))
