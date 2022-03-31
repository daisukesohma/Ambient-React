import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  dispatchMenuComponent: {
    backgroundColor: palette.common.white,
    padding: 16,
    borderRadius: 4,
    fontSize: 18,
    bottom: '7.7em',
    left: 0,
    position: 'absolute',
  },
  dispatchMenuComponentRow: {
    padding: 4,
    marginBottom: 4,
    display: 'flex',
  },
  dispatchMenuComponentRowLast: {
    display: 'flex',
  },
  dispatchMenuComponentRowSelectedTs: {
    fontSize: 12,
  },
}))
