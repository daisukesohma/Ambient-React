import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(2),
  },
  button: {
    padding: 0,
  },
  bookmark: {
    paddingTop: spacing(0.5),
  },
}))
