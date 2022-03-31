import { makeStyles } from '@material-ui/core/styles'
import { isMobileOnly } from 'react-device-detect'

export default makeStyles(() => ({
  siteSelectorContainer: {
    minWidth: 250,
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: isMobileOnly ? 'column' : 'row',
  },
}))
