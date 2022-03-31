import { makeStyles } from '@material-ui/core/styles'
import { VP_TOP_BAR_HEIGHT } from '../../constants'

export default makeStyles(({ palette }) => ({
  root: {
    minHeight: VP_TOP_BAR_HEIGHT,
    padding: '0 30px',
  },
  progressBar: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  socketPulse: {
    marginLeft: 5,
  },
  phoneIcon: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  phoneTooltip: {
    padding: '2px 8px',
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: 4,
    color: palette.error.main,
  },
}))
