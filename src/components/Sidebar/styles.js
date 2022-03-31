import { makeStyles } from '@material-ui/core/styles'

const drawerWidth = 240

export default makeStyles(
  ({ spacing, breakpoints, transitions, palette, mixins }) => ({
    SidebarDrawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent !important',
      position: ({ mobile }) => (mobile ? 'absolute' : 'unset'),
      top: 0,
      bottom: 0,
    },
    SidebarDrawerOpen: {
      '&&': {
        width: drawerWidth,
        transition: transitions.create('width', {
          easing: transitions.easing.sharp,
          duration: transitions.duration.enteringScreen,
        }),
        backgroundColor: palette.common.black,
        overflowX: 'hidden',
      },
    },
    SidebarDrawerClose: {
      '&&': {
        transition: transitions.create('width', {
          easing: transitions.easing.sharp,
          duration: transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: spacing(7) + 1,
        [breakpoints.up('sm')]: {
          width: spacing(9) + 1,
        },
        backgroundColor: palette.common.black,
      },
    },
    SidebarMenuContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'column',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    SidebarToolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: ({ sideBarOpened }) =>
        sideBarOpened ? 'flex-end' : 'center',
      width: '100%',
      ...mixins.toolbar,
    },
    SidebarLogoWrapper: {
      paddingTop: spacing(1.5),
      paddingBottom: spacing(1),
      paddingLeft: ({ sideBarOpened }) => (sideBarOpened ? spacing(2) : 'auto'),
      paddingRight: ({ sideBarOpened }) =>
        sideBarOpened ? spacing(2) : 'auto',
    },
    SwitchButton: {
      padding: 10,
    },
    SidebarLogo: {
      width: ({ sideBarOpened }) => (sideBarOpened ? '70%' : 40),
    },
    SidebarIconBtn: {
      '&&': {
        color: palette.primary.main,
      },
    },
    SidebarAvatar: {
      '&&': {
        width: ({ sideBarOpened }) => (sideBarOpened ? spacing(4) : 40),
        height: ({ sideBarOpened }) => (sideBarOpened ? spacing(4) : 40),
        backgroundColor: palette.common.tertiary,
        fontSize: 14,
        color: 'white',
        marginRight: ({ sideBarOpened }) => (sideBarOpened ? 10 : 0),
      },
    },
    SidebarAvatarContainer: {
      display: 'flex',
      justifyContent: ({ sideBarOpened }) =>
        sideBarOpened ? 'flex-start' : 'center',
      flexDirection: 'row',
      padding: spacing(1),
      margin: spacing(2),
      alignItems: 'center',
    },
    SidebarUserName: {
      '&&': {
        color: palette.common.white,
        display: ({ sideBarOpened }) => (sideBarOpened ? 'block' : 'none'),
        // ellipsis
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },
  }),
)
