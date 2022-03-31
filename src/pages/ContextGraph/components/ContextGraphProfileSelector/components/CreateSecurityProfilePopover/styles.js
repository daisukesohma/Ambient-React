import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    boxShadow: '2px -1px 11px 1px #222428',
    marginTop: spacing(2),
    border: `1px solid ${palette.text.secondary}`,
  },
  addNewButton: {
    padding: spacing(1),
  },
}))
