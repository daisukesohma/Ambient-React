import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  downloadLink: {
    textDecoration: 'none',
    color: theme.palette.grey[700],
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))
