import { makeStyles } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'

export default makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
  },
  controller: {
    height: isMobile ? 'unset' : 80,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: isMobile ? 'column' : 'row',
    marginBottom: isMobile ? 8 : 'unset',
  },
  searchContainer: {
    width: isMobile ? 280 : 272,
    marginRight: isMobile ? 0 : theme.spacing(2),
  },
  tableInfoContainer: {
    marginTop: isMobile ? theme.spacing(1) : 0,
  },
  searchInput: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.grey[700],
    border: `1px solid ${theme.palette.grey[100]} !important`,
    boxSizing: 'border-box',
    borderRadius: '20px',
  },
  searchText: {
    fontSize: 14,
    color: theme.palette.grey[700],
    padding: '2px 10px',
    width: '100%',
  },
  searchIcon: {
    color: theme.palette.grey[500],
  },
  rightController: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    marginTop: isMobile ? theme.spacing(1) : 0,
  },
  leftController: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
  },
  downloadLink: {
    textDecoration: 'none',
  },
}))
