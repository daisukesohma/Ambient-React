import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing(1),
    marginBottom: spacing(2),
  },
  statusText: {
    color: palette.grey[700],
  },
  statusTextItem: {
    marginRight: spacing(3),
  },
}))
