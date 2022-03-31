import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, transitions, palette, breakpoints }) => ({
  root: {
    // background: palette.grey[800],
    // color: palette.common.white,
  },
  boxRoot: {
    border: palette.grey[600],
  },
  textTruncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  drawerOpen: {
    transition: transitions.create('width', {
      easing: transitions.easing.sharp,
      duration: 500,
    }),
  },
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
  paperDrawer: {
    position: 'relative',
    overflow: 'hidden',
    // backgroundColor: palette.common.white,
    // color: palette.common.black,
  },
  paperDrawerDark: {
    position: 'relative',
    overflow: 'hidden',
    // backgroundColor: `${palette.common.black} !important`,
    // color: `${palette.common.white} !important`,
  },
  titleWrapper: {
    '&&': {
      boxSizing: 'border-box',
      borderBottom: '1px solid',
      borderColor: `${palette.grey[500]} !important`,
      padding: '8px 16px',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  regionsWrapper: {
    '&&': {
      boxSizing: 'border-box',
      padding: '8px 8px 12px 16px',
      display: 'flex',
      flex: 1,
      overflowY: 'scroll',
      flexDirection: 'column',
      '&::-webkit-scrollbar': {
        width: 6,
      },
    },
  },
  sectionTitle: {
    paddingTop: 8,
    textTransform: 'none',
  },
  paramWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 12,
  },
  paramWrapperWithborder: {
    borderBottom: '1px solid',
  },
  textField: {
    '&&': {
      width: 170,
      marginRight: 10,
    },
  },
  textInput: {
    '&&': {
      paddingLeft: 16,
    },
  },
  footerWrapper: {
    padding: '0 16px 16px 8px',
  },
  deleteButton: {
    '&&': {
      color: palette.error.main,
    },
  },
  cancelButton: {
    '&&': { marginRight: 20 },
  },
  saveButton: {
    '&&': {
      // backgroundColor: palette.grey[500],
      // color: palette.common.white,
      padding: '0 24px',
      letterSpacing: '0.75px',
      borderRadius: 20,
    },
  },
  regionAutocompleteInput: {
    maxHeight: '200px',
    overflowY: 'scroll',
  },
}))
