import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    background: theme.palette.grey[800],
    position: 'relative',
  },
  videoBox: {
    height: '100%',
    background: theme.palette.common.black,
  },
  dropBox: {
    height: '100%',
    color: theme.palette.grey[500],
  },

  selectBox: ({ hovered }) => ({
    height: 40,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: hovered ? 1 : 0,
  }),

  placeholder: {
    color: theme.palette.grey[500],
  },
}))
