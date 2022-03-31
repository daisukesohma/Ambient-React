import { makeStyles } from '@material-ui/core/styles'
import { isTablet } from 'react-device-detect'

export const useStyles = makeStyles(theme => ({
  toolContainer: {
    marginBottom: theme.spacing(3),
  },
  toolInnerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  toolMainContainer: ({ isMobile }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    marginLeft: -8,
    marginRight: -8,
  }),
  topBarItem: ({ isMobile }) => ({
    width: isMobile ? '100%' : 'unset',
    margin: isMobile ? 4 : 'unset',
    '& .MuiFormControl-root': {
      width: isMobile ? '100%' : 'unset',
      '& > div': {
        margin: isMobile ? 0 : '0px 8px',
      },
    },
  }),
  dateWrapper: {
    width: isTablet ? '100%' : 'unset',
  },
  siteSelector: {
    minWidth: 250,
  },
}))
