import { makeStyles } from '@material-ui/core/styles'
import { isMobileOnly } from 'react-device-detect'

export default makeStyles(({ spacing }) => ({
  additionalToolsContainer: {
    marginRight: isMobileOnly ? 0 : spacing(4),
    marginBottom: isMobileOnly ? spacing(1) : 0,
  },
}))
