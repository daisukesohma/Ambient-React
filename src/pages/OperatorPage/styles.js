import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  maximized: ({ isMobile }) => ({
    // Edit this
    height: isMobile ? window.innerHeight * 0.7 : '100%',
    overflowY: 'auto',
  }),
  dashboardContainer: {
    paddingTop: ({ isMobile }) => (isMobile ? 24 : 55),
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
  mobileSecurity: {
    width: '100%',
    '& .MuiTab-root': {
      padding: '6px 16px',
      width: '34%',
    },
  },
  mobileSiteSelector: {
    marginBottom: spacing(2),

    '& .am-dropdown-form-control': {
      width: '100%',
      boxSizing: 'border-box',
    },
  },
  checkInOutBar: {
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
}))
