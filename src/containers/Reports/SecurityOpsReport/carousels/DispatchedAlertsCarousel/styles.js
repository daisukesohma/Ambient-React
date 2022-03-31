import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ spacing }) => ({
  root: {
    margin: spacing(2, 0.5),
  },
  title: {
    padding: spacing(2),
  },
}))
