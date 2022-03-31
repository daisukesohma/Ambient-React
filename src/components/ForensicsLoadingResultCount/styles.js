import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    marginRight: spacing(2),
  },
  loadingContainer: {
    padding: spacing(1),
    borderRadius: spacing(2),
    border: `1px solid ${palette.primary[300]}`,
  },
  loadingIcon: {
    marginRight: spacing(1),
  },
}))
