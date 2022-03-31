import { makeStyles } from '@material-ui/core/styles'

const panelBarHeight = 40
const panelTopOffset = 40
const panelWidth = 256

export default makeStyles(({ palette }) => ({
  root: ({ opened }) => ({
    position: 'fixed',
    height: '100%',
    width: panelWidth,
    top: opened ? 40 : `calc(100% - ${panelTopOffset}px)`,
    right: 0,
    boxShadow: 'rgba(34, 36, 40, 0.1) 0px 1px 30px',
    zIndex: 1,
  }),

  header: {
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    cursor: 'pointer',
    height: panelBarHeight,
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },

  body: {
    height: `calc(100% - ${panelTopOffset + panelBarHeight}px)`,
    backgroundColor: palette.common.white,
    display: 'flex',
    flexDirection: 'column',
  },

  bodyContent: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },

  userGroupHeader: {
    height: 40,
    minHeight: 40,
    fontWeight: 500,
    fontSize: 10,
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    color: '#626469',
    marginLeft: 15,
  },

  userItem: {
    height: 40,
    display: 'flex',
    minHeight: 40,
  },

  userItemActive: {
    background: '#F2F4F7',
  },

  avatar: {
    width: 30,
    height: 30,
  },

  avatarBlock: {
    marginLeft: 16,
    marginRight: 7,
  },

  nameBlock: {
    fontWeight: 500,
    fontSize: 14,
    alignItems: 'center',
    letterSpacing: 0.15,
    color: '#626469',
    flex: 1,
    display: 'inline-block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginRight: 4,
  },

  noUsers: {
    fontWeight: 500,
    fontSize: 14,
    color: '#626469',
  },

  nameBlockOffline: {
    color: '#9FA2A7',
  },

  offlineDot: {
    backgroundColor: palette.grey[500],
  },

  userStatusBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    marginRight: 16,
  },

  userStatusText: {
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    letterSpacing: 0.4,
    color: '#9FA2A7',
  },

  searchInput: {
    backgroundColor: palette.grey[50],
    height: 48,
    borderRadius: 0,
    border: 0,
    paddingLeft: 10,
  },

  footer: {
    borderTop: '1px solid #F2F4F7',
    width: panelWidth,
    height: 48,
    borderRadius: 0,
    border: 0,
  },
}))
