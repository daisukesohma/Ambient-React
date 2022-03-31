import { isMobile } from 'react-device-detect'
import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: isMobile ? theme.spacing(1) : 0,
    background: 'white',
  },
  children: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    margin: isMobile ? 0 : '0px 32px 48px 40px',
  },
  logo: {
    width: 108,
  },
  column: {
    flexDirection: 'column',
  },
}))
