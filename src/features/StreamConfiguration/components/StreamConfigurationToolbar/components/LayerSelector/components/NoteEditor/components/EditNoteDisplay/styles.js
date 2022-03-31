import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    borderBottom: `1px solid ${palette.text.secondary}`,
    marginBottom: spacing(1),
  },
  cardRoot: {
    boxShadow: 'none',
    borderRadius: 0,
  },
  textField: {
    marginRight: spacing(1),
    width: '100%',
  },
  inputUnderline: {
    '&:before': {
      borderBottom: `1px solid ${palette.text.secondary}`,
    },
  },
}))
