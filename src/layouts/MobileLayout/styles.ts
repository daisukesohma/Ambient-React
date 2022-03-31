import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  mobileLayout: {
    display: 'flex',
    height: '100%',
  },
  main: {
    flexGrow: 1,
    height: '100%',
    overflowX: 'hidden',
  },
}))
