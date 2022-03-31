import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    position: 'relative',
    height: '100%',
    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
  },

  badge: {
    alignItems: 'center',
    backgroundColor: palette.error.main,
    borderRadius: 4,
    color: palette.common.white,
    display: 'flex',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  scrollable: {
    overflowY: 'auto',
    height: 'calc(100% - 48px)',
  },

  droppableRoot: {
    height: '100%',
  },

  tabWrapper: {
    flexDirection: 'row',
  },
  tabRoot: {
    minWidth: 50,
  },
}))
