import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  buttonRoot: {
    borderRadius: '20px !important',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  paper: {
    width: '100%',
    position: 'relative',
    border: 'unset',
  },
}))

export default useStyles
