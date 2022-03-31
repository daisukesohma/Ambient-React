import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  background: {
    // backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/jess-harding-lqT6NAmTaiY-unsplash.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    clipPath: 'inset(0em)',
    filter: 'blur(30px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  content: {
    position: 'absolute',
    zIndex: 20,
    padding: theme.spacing(0, 2),
    width: '100%',
    boxSizing: 'border-box',
    left: 0,
  },
}))
