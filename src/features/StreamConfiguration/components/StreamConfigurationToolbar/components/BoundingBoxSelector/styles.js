import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
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
