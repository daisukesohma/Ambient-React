import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  dividerRoot: {
    marginTop: spacing(2),
  },
  modal: {
    position: 'absolute',
    width: '60%',
    left: '20%',
    top: '10%',
    padding: spacing(3),
    border: `1px solid ${palette.grey[700]}`,
  },
  unselectedSev: {
    opacity: 0.4,
  },
  renderCheckbox: {
    marginRight: spacing(1),
  },
  selectedSev: {
    opacity: 1,
  },
  validText: {
    color: palette.primary.main,
  },
  warningText: {
    color: palette.error.main,
  },
  inputUnderline: {
    '&:before': {
      borderBottom: `1px solid ${palette.grey[600]}`,
    },
  },
}))
