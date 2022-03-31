import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, transitions, palette, breakpoints }) => ({
  wrapper: {
    position: 'relative',
    width: 500,
    height: '100%',
    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
  },
  detailPopoverPaper: {
    border: `1px solid ${palette.grey[700]}`,
  },
  divider: ({ filterOpen }) => ({
    padding: filterOpen ? spacing(2, 0, 0, 0) : spacing(1.5, 0, 0, 0),
  }),
  dividerRoot: {
    // background: palette.grey[800],
  },
  textTruncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  drawerOpen: ({ isMobileOnly }) => ({
    height: isMobileOnly ? 'calc(100% - 202px)' : '100%',
  }),
  drawerClose: {
    transition: transitions.create('width', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: spacing(7) + 1,
    [breakpoints.up('sm')]: {
      width: spacing(9) + 1,
    },
  },
  filterContainer: {
    '&:hover': {
      background: hexRgba(palette.primary[500], 0.15),
    },
    padding: spacing(1),
    borderRadius: spacing(0.5),
    margin: spacing(1),
  },
  filterTitle: {
    margin: spacing(1, 1, 0.5, 2),
  },
  filterMenu: {
    marginLeft: spacing(1.5),
  },
  paperDrawer: {
    position: 'relative',
    overflow: 'hidden',
  },
  paperDrawerDark: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  titleWrapper: {
    height: 80,
    padding: '20px 16px',
    fontSize: 20,
    lineHeight: '24px',
    letterSpacing: '0.02em',
    boxSizing: 'border-box',
  },
  titleWrapper__btn: {
    '&&': {
      minWidth: 40,
      width: 40,
      height: 40,
      boxShadow:
        '0px 1px 10px rgba(24, 129, 255, 0.2), 0px 4px 5px rgba(34, 36, 40, 0.08), 0px 2px 4px rgba(98, 100, 105, 0.2)',
      borderRadius: '50%',
      backgroundColor: palette.primary.main,
      fontSize: 16,
    },
  },
  listWrapper: ({ filterOpen, isDeployOpen }) => {
    let heightDiff = 288
    if (!isDeployOpen) {
      heightDiff -= 50
      if (filterOpen) heightDiff += 200
    } else if (filterOpen) heightDiff += 130

    return {
      height: `calc(100% - ${heightDiff}px)`,
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: 6,
        borderRadius: 4,
      },
    }
  },
  listHeaderItem: {
    display: 'flex',
    alignItems: 'center',
  },
  draftSpan: {
    color: palette.error.main,
    marginLeft: 4,
  },

  popoverWhite: {
    // backgroundColor: palette.grey[300],
    // color: palette.common.black,
  },

  popoverBlack: {
    // backgroundColor: palette.grey[800],
    // color: palette.common.white,
  },
  paperClassOverride: {
    marginTop: '16px !Important',
  },
  addIcon: ({ darkMode }) => ({
    '&&': {
      fill: palette.text.primary,
    },
  }),
  listItemIcon: ({ toolbarOpened }) => ({
    minWidth: 0,
    margin: toolbarOpened ? '0px 16px 0px 0px' : '0px 0px 0px 8px',
  }),

  createAlert: {
    position: 'absolute',
    width: '100%',
    height: spacing(4),
    left: 0,
    bottom: 0,
    borderTop: `1px solid ${palette.grey[800]}`,
    padding: spacing(3),
    boxSizing: 'border-box',
    fontFamily: '"Aeonik-Regular", "Roboto"',
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: 0.15,
    borderRight: 'none',
    cursor: 'pointer',
    ':focus': {
      boxShadow: 'inset 0px 0px 5px #c1c1c1',
    },
  },
  selectedFilter: {
    color: palette.secondary.main,
  },
  treeWrapper: {
    padding: 0,
  },
  treeItemGroup: ({ darkMode }) => ({
    '&&': {
      marginLeft: 18,
      borderLeft: `1px solid ${palette.grey[darkMode ? 800 : 300]}`,
    },
  }),
  treeItemContentRoot: {
    '&&': {
      paddingLeft: 18,
    },
  },
  treeItemContentWithoutBorder: {
    '&&': {
      border: 'none !important',
    },
  },
  treeItemContentSelectedWhite: {
    backgroundColor: `${palette.primary[50]} !important`,
  },
  treeItemContentSelectedBlack: {
    backgroundColor: `${palette.grey[800]} !important`,
  },
  treeItemContentWall: {
    '&&': {
      paddingRight: 2,
    },
  },
  treeItemContent: ({ darkMode }) => ({
    '&&': {
      flexDirection: 'row-reverse',
      minHeight: 43,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${palette.grey[darkMode ? 800 : 300]}`,
      '&:hover': {
        backgroundColor: darkMode ? palette.grey[800] : palette.primary[50],
      },
    },
    padding: '0 18px 0 6px',
  }),

  treeItemIconContainer: {
    '&&': {
      marginRight: 0,
      width: 18,
    },
  },
  treeItemIconContainerHidden: {
    '&&': {
      display: 'none',
    },
  },
  treeLabelRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  typography: {
    padding: spacing(2),
    cursor: 'pointer',
  },
  switch: {
    '& .MuiSwitch-switchBase': {
      // color: '#F8FBFF',
      padding: spacing(1),
      position: 'absolute',
      transition: 'left 150ms',
    },
  },
  alertLevelLabel: {
    '& span': {
      padding: '0px',
    },
  },
  mainButton: {
    borderLeft: '1px solid white',
    '&:hover': {
      background: palette.common.greenPastel,
    },
  },
}))
