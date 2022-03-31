import { makeStyles } from '@material-ui/core/styles'

const panelBarHeight = 40
const panelTopOffset = 40
const panelWidth = 256

export default makeStyles(({ spacing, palette }) => ({
  siteName: ({ darkMode }) => ({
    marginLeft: 0,
    marginRight: spacing(1),
    color: palette.grey[darkMode ? 200 : 700],
  }),
  root: ({ opened }) => ({
    position: 'fixed',
    height: '100%',
    width: panelWidth,
    top: opened ? 40 : `calc(100% - ${panelTopOffset}px)`,
    right: 0,
    boxShadow: 'rgba(34, 36, 40, 0.1) 0px 1px 30px',
    zIndex: 11,
  }),
  header: {
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    cursor: 'pointer',
    height: panelBarHeight,
    minHeight: panelBarHeight,
    width: '100%',
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    borderTopRightRadius: spacing(0.5),
    borderTopLeftRadius: spacing(0.5),
  },
  headerSiteList: ({ darkMode }) => ({
    marginTop: spacing(1),
    background: 'transparent',
    color: darkMode ? palette.common.white : palette.grey[900],
  }),
  body: ({ darkMode }) => ({
    height: `calc(100% - ${panelTopOffset + panelBarHeight}px)`,
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    display: 'flex',
    flexDirection: 'column',
  }),

  bodyContent: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    paddingRight: spacing(0.5),
    '&::-webkit-scrollbar': {
      width: spacing(1),
    },
  },

  collapseRoot: {
    minHeight: '60px !important',
  },

  siteItem: ({ darkMode }) => ({
    cursor: 'pointer',
    height: 40,
    display: 'flex',
    minHeight: 40,
    justifyContent: 'space-between',
    color: darkMode ? palette.common.white : palette.grey[800],
    paddingLeft: spacing(2),
  }),

  noSites: {
    height: 60,
    minHeight: 60,
    fontWeight: 500,
    fontSize: 16,
    color: palette.grey[500],
    paddingTop: spacing(2),
  },

  searchInput: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.common.black : palette.grey[50],
    color: darkMode ? palette.common.white : palette.common.black,
    height: 48,
    borderRadius: 0,
    border: 0,
    paddingLeft: 10,
  }),

  footer: {
    borderTop: '1px solid #F2F4F7',
    width: panelWidth,
    height: 48,
    borderRadius: 0,
    border: 0,
  },

  checkboxWrapper: {
    display: 'flex',
  },
  checkboxRoot: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.primary.main,
    // '&$checked': {
    //   color: darkMode ? palette.common.white : palette.primary.main,
    // },
  }),
  checkboxChecked: {},

  alertRoot: {
    padding: spacing(0.5, 0.5),
    fontSize: 14,
    lineHeight: 1,
  },
  alertTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
  },

  siteChipWrapper: {
    padding: spacing(0, 1),
  },
  siteChip: {
    borderRadius: spacing(0.5),
    backgroundColor: palette.primary[50],
    padding: spacing(0.5),
    margin: spacing(0.5, 0.5, 0, 0),
  },

  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing(3),
    height: spacing(3),
    borderRadius: '50%',
    fontSize: 11,
    backgroundColor: palette.common.greenPastel,
    color: palette.grey[700],
  },
  badgeWarning: {
    backgroundColor: palette.error.main,
    color: palette.common.white,
  },
  headerTitle: {
    color: palette.grey[500],
  },

  nested: ({ darkMode }) => ({
    paddingLeft: spacing(4),
    color: darkMode ? palette.common.white : palette.common.black,
  }),

  modalBody: {
    background: palette.grey[100],
    margin: spacing(2, 0),
    padding: spacing(2),
  },
  userInformation: {
    marginLeft: spacing(2),
  },

  tabRoot: ({ darkMode }) => ({
    minWidth: 100,
    color: darkMode ? palette.common.white : palette.common.black,
  }),

  inactive: {
    display: 'none',
  },
}))
