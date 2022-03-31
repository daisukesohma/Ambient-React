import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0.5),
    width: '100%',
  },
  title: {
    padding: theme.spacing(2),
  },
}))
