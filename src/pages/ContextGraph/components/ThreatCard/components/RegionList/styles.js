import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  on: {
    marginLeft: spacing(0.5),
    marginRight: spacing(0.5),
  },
  regionContainer: {
    borderRadius: spacing(0.5),
    padding: spacing(0.5),
  },
}))
