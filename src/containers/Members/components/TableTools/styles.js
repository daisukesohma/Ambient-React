import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  syncBtn: {
    backgroundColor: palette.common.white,
    width: 35,
    height: 35,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: 16,
  },
  refreshIcon: {
    color: palette.primary.main,
  },
  controllerTxt: {
    fontSize: 14,
    color: palette.grey[700],
    marginRight: '8px !important',
  },
  statusContainer: {
    marginRight: 24,
  },
  infoContainer: {
    backgroundColor: palette.grey[200],
    borderRadius: 4,
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    marginRight: 8,
  },
  infoTxt: {
    marginLeft: 8,
  },
}))
