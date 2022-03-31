import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    margin: 0,
  },
  lastSyncText: {
    marginRight: 16,
    color: palette.grey[700],
  },
  header: {
    color: palette.common.black,
    fontSize: 20,
    letterSpacing: '0.02em',
    fontWeight: 'normal',
  },
  label: {
    color: palette.grey[700],
  },
  input: {
    fontSize: 20,
    letterSpacing: '0.02em',
  },
  deleteButton: {
    cursor: 'pointer',
  },
}))
