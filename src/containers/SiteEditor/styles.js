import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  drawerWrapper: {
    position: 'relative',
    width: 256,
    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
  },
  subtext: {
    color: '#3a3a3a',
  },
  highlight: {
    padding: '5px',
    backgroundColor: '#d9d9d9',
    borderRadius: '8px',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
}))

export default useStyles
