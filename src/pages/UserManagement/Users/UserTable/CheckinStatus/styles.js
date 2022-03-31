import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 4,
    margin: 4,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    color: palette.grey[500],
    padding: spacing(0.25, 1),
    borderRadius: spacing(0.5),
    border: `1px solid ${palette.grey[500]}`,
  },
  activeRoot: {
    borderRadius: 4,
    margin: 4,
    backgroundColor: palette.primary.main,
    height: 40,
  },
  activeLabel: {
    fontSize: 14,
    color: palette.common.white,
    padding: spacing(0.25, 1),
    borderRadius: spacing(0.5),
  },
}))
