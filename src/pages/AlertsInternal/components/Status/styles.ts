import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  pulse: {
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
  },
}))
