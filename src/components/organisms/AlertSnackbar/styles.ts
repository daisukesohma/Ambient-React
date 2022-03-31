import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    background: palette.background.default,
    color: palette.text.primary,
    minWidth: 300,
    padding: spacing(1, 2, 1, 2),
    borderRadius: spacing(1),
    boxShadow: palette.common.shadows.soft,
  },
  icon: {
    color: palette.success.main,
    paddingRight: spacing(1),
    alignItems: 'center',
    display: 'flex',
  },
  actions: {
    justifyContent: 'flex-end',
    display: 'flex',
  },
  undo: {
    color: palette.common.buttonBlue,
    textTransform: 'none',
  },
}))
