import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  dashboardContainer: {
    '& .introjs-newsfeed': {
      top: ({ isMobile, overriddenData }) =>
        // eslint-disable-next-line no-nested-ternary
        isMobile ? (overriddenData ? 155 : 105) : 70,
    },
  },
  dashboardMain: {
    height: '100%',
  },
  dashboardTopBar: {
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing(3),
  },
  dashboardSecurityProfileSelector: {
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    letterSpacing: '0.00938em',
    lineHeight: 1.5,
  },
  topAlert: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 5,
  },
  topAlertContent: {
    alignItems: 'center',
    backgroundColor: palette.warning.main,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    padding: spacing(0.5, 2, 0.5, 2),
  },
  alertText: {
    color: palette.grey[700],
    marginLeft: 8,
  },
  mobileTop: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },

  mobileSecurity: {
    width: '100%',
    '& .MuiTab-root': {
      padding: '6px 16px',
      width: '34%',
    },
  },
  switch: {
    '& .MuiSwitch-switchBase': {
      color: palette.common.white,
      padding: 9,
      position: 'absolute',
      transition: 'left 150ms',
    },
  },
}))
