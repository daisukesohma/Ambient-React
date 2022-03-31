import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  authLayout: {
    display: 'flex',
    position: 'relative',
  },
  main: {
    height: '100vh',
    width: '100%',
    flexGrow: 1,
    overflowY: 'unset',
    overflowX: 'unset',
  },
}))
