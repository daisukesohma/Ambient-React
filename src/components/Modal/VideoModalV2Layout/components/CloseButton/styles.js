import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  closeRoot: {
    top: 0,
    height: 40,
    left: 0,
    position: 'absolute',
    width: 40,
    zIndex: 10,
    padding: theme.spacing(2, 0, 0, 2),
    opacity: 0,
    background: 'transparent',
    transition: 'visibility .5s, opacity .5s',
  },
  userActive: {
    opacity: 1,
    visibility: 'visible',
    transition: 'visibility .5s, opacity .5s',
  },
  iconButtonRoot: {
    // background: theme.palette.common.black,
    transition: 'background 10ms cubic-bezier(1,0,0,1) 0ms',
    // '&:hover': {
    //   background: theme.palette.grey[800],
    // },
  },
}))
