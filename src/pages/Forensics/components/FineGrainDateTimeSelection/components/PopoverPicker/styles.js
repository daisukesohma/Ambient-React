import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    width: 600,
    padding: spacing(1),
    border: `1px solid ${palette.grey[800]}`,
    borderRadius: spacing(0.5),
  },
}))
