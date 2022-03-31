import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  hoverContainer: {
    color: theme.palette.common.white,
    top: theme.spacing(1),
    left: theme.spacing(1),
    right: theme.spacing(1),
    width: 'auto',
    padding: 5,
    zIndex: 1000000,
    borderRadius: 4,
    boxSizing: 'border-box',
    background: theme.palette.common.black,
    position: 'absolute',
    height: 50,
  },

  expandIcon: {
    position: 'absolute',
    top: theme.spacing(1.5),
    right: theme.spacing(1),
    zIndex: 1000000,
    cursor: 'pointer',
  },
}))
