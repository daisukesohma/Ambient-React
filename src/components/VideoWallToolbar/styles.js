import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    height: '100%',
    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
  },
  textTruncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  drawerOpen: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: 500,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  paperDrawer: ({ darkMode }) => ({
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  }),
  paperDrawerDark: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: `${theme.palette.common.black} !important`,
    color: `${theme.palette.common.white} !important`,
  },
  titleWrapper: ({ showFooter }) => ({
    width: showFooter ? 300 : '100%',
    height: 80,
    padding: '20px 16px',
    fontSize: 20,
    lineHeight: '24px',
    letterSpacing: '0.02em',
    boxSizing: 'border-box',
  }),
  titleWrapper__btn: {
    '&&': {
      minWidth: 40,
      width: 40,
      height: 40,
      boxShadow:
        '0px 1px 10px rgba(24, 129, 255, 0.2), 0px 4px 5px rgba(34, 36, 40, 0.08), 0px 2px 4px rgba(98, 100, 105, 0.2)',
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      fontSize: 16,
    },
  },
  listWrapper: ({ showFooter }) => ({
    width: showFooter ? 300 : '100%',
    height: showFooter ? 'calc(100% - 176px)' : '100%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 6,
      borderRadius: 4,
    },
  }),
  listItem: ({ darkMode }) => ({
    '&&': {
      padding: '0 18px',
      cursor: 'pointer',
      height: 43,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
      '&:hover': {
        backgroundColor: theme.palette.grey[darkMode ? 800 : 300],
      },
    },
    '& svg': {
      width: 18,
      height: 18,
    },
  }),

  popoverWhite: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.common.black,
  },

  popoverBlack: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
  },
  paperClassOverride: {
    marginTop: '16px !Important',
  },
  listItemIcon: ({ toolbarOpened }) => ({
    minWidth: 0,
    margin: toolbarOpened ? '0px 16px 0px 0px' : '0px 0px 0px 8px',
  }),

  modeSelector: ({ darkMode, showFooter }) => ({
    position: 'absolute',
    width: showFooter ? 300 : '100%',
    height: 64,
    left: 0,
    bottom: 0,
    background: darkMode ? theme.palette.common.black : theme.palette.grey[50],
    borderTop: `1px solid ${theme.palette.grey[darkMode ? 800 : 300]}`,
    padding: 24,
    boxSizing: 'border-box',
    fontFamily: '"Aeonik-Regular", "Roboto"',
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: 0.15,
    color: theme.palette.grey[500],
  }),

  treeWrapper: {
    padding: 0,
  },
  treeItemRootBlack: {
    '&&': {
      '&:focus > .MuiTreeItem-content': {
        backgroundColor: theme.palette.grey[800],
      },
    },
  },
  treeItemRootWhite: {
    '&&': {
      '&:focus > .MuiTreeItem-content': {
        backgroundColor: theme.palette.grey[300],
      },
    },
  },
  treeItemGroup: ({ darkMode }) => ({
    '&&': {
      marginLeft: 18,
      borderLeft: `1px solid ${theme.palette.grey[darkMode ? 800 : 300]}`,
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
    backgroundColor: `${theme.palette.primary[50]} !important`,
  },
  treeItemContentSelectedBlack: {
    backgroundColor: `${theme.palette.grey[800]} !important`,
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
      borderBottom: `1px solid ${theme.palette.grey[darkMode ? 800 : 300]}`,
      '&:hover': {
        backgroundColor: darkMode
          ? theme.palette.grey[800]
          : theme.palette.primary[50],
      },
      '& .MuiTreeItem-label': {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    padding: '0 18px 0 6px',
  }),
  treeItemLabel: {
    backgroundColor: 'inherit !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    '& .MuiTreeItem-label': {
      backgroundColor: 'inherit !important',
      '&:hover': {
        backgroundColor: 'transparent !important',
      },
    },
  },

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
    '& svg': {
      width: 18,
      height: 18,
      marginRight: theme.spacing(2),
      color: theme.palette.grey[500],
    },
  },
  treeUserIcon: {
    '& svg': {
      position: 'relative',
      left: 4,
    },
  },
  'treeItem__expand-icon': {
    '&&': {
      width: 16,
    },
  },
  typography: {
    padding: theme.spacing(2),
    cursor: 'pointer',
  },

  switch: {
    '& .MuiSwitch-switchBase': {
      color: '#F8FBFF',
      padding: 9,
      position: 'absolute',
      transition: 'left 150ms',
    },
  },
}))
