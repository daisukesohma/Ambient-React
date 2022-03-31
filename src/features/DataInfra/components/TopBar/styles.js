import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    padding: '0 50px',
  },
  socketPulse: {
    marginLeft: 10,
  },
  leftContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rightContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  refreshIcon: {
    color: palette.primary.main,
    padding: '0 12px',
    cursor: 'pointer',
  },
  viewLabel: {
    fontSize: 14,
    color: palette.grey[500],
  },
  syncIcon: {
    color: palette.primary.main,
    fontSize: 20,
    margin: 4,
    cursor: 'pointer',
  },
  phoneIcon: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '10px',
    marginTop: '2px',
  },
  phoneTooltip: {
    padding: '2px 8px',
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: 4,
    color: palette.error.main,
  },
}))
