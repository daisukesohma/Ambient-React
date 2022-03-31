import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  actionsContainer: {
    width: 32,
    height: 20,
    background: theme.palette.grey[100],
    mixBlendMode: 'normal',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.grey[700],
    cursor: 'pointer',
  },
  infoContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  nameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  name: ({ isMini }) => ({
    alignItems: 'center',
    background: theme.palette.common.black,
    borderRadius: 4,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    margin: isMini ? 6 : 8,
    opacity: 0.9,
    padding: isMini ? '6px 10px' : '9px 11px 9px 16px',
  }),
  overlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,.35)',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  root: ({ isHover, darkMode }) => {
    const getBorderColor = () => {
      if (isHover) return theme.palette.error.main
      return theme.palette.grey[darkMode ? 800 : 300]
    }

    return {
      width: '100%',
      borderRadius: 4,
      background: darkMode
        ? theme.palette.common.black
        : theme.palette.common.white,
      border: `1px solid ${getBorderColor()}`,
      boxSizing: 'border-box',
      boxShadow: isHover ? '0px 0px 15px rgba(253, 35, 92, 0.5)' : null,
    }
  },
}))
