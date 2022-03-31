import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  titleRoot: {
    height: 60,
    left: 0,
    marginLeft: theme.spacing(10),
    width: 'fit-content',
    opacity: 0,
    paddingTop: theme.spacing(2),
    position: 'absolute',
    top: 0,
    transition: 'visibility .5s, opacity .5s',
    visibility: 'hidden',
    zIndex: 10,
    boxSizing: 'border-box',
  },
  title: {
    color: theme.palette.grey[50],
  },
  subTitle: {
    color: theme.palette.grey[100],
  },
  userActive: {
    opacity: 1,
    visibility: 'visible',
    transition: 'visibility .5s, opacity .5s',
  },
  internetSpeed: {
    marginLeft: theme.spacing(6),
    opacity: 0.7,
  },
}))
