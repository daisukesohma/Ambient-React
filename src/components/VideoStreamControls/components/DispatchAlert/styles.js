import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  button: {
    display: 'flex',
    outline: 'none',
  },
  icon: {
    color: palette.error.main,
    paddingRight: 5,
  },
}))
