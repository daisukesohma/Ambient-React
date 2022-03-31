import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    borderRadius: 4,
    margin: 4,
    backgroundColor: palette.grey[100],
  },
  label: {
    fontSize: 12,
    color: palette.grey[700],
  },
  more: {
    maxWidth: 250,
    padding: 8,
  },
  moreIcon: {
    width: 20,
  },
  moreLabel: {
    paddingRight: 0,
  },
}))
