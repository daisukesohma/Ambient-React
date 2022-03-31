import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    borderRadius: 4,
    height: 24,
    padding: '3px 10px',
  },
  low: {
    backgroundColor: palette.common.productBlue,
  },
  medium: {
    backgroundColor: palette.common.lime,
  },
  high: {
    backgroundColor: palette.common.magenta,
  },
  label: {
    padding: 0,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '18px',
    color: palette.common.black,
  },
}))
