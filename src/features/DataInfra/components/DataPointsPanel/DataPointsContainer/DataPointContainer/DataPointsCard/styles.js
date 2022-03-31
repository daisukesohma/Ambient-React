import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  actionsContainer: {
    width: 32,
    height: 20,
    background: palette.grey[100],
    mixBlendMode: 'normal',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.grey[700],
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
  viewContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  name: ({ isMini }) => ({
    alignItems: 'center',
    background: palette.common.black,
    borderRadius: 4,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    margin: isMini ? 6 : 8,
    opacity: 0.9,
    padding: isMini ? '6px 10px' : '9px 11px 9px 16px',
  }),
  viewIcon: {
    alignItems: 'center',
    background: palette.common.black,
    borderRadius: ({ isMini }) => (isMini ? 2.75 : 4),
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.9,
    cursor: 'pointer',
    height: ({ isMini }) => (isMini ? 24 : 36),
    margin: ({ isMini }) => (isMini ? 5.5 : 8),
    width: ({ isMini }) => (isMini ? 24 : 36),
  },
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
      if (isHover) {
        return palette.error.main
      }
      if (darkMode) {
        return palette.grey[800]
      }
      return palette.grey[300]
    }

    return {
      width: '100%',
      borderRadius: 4,
      background: darkMode ? palette.common.black : palette.common.white,
      border: `1px solid ${getBorderColor()}`,
      boxSizing: 'border-box',
      boxShadow: isHover ? '0px 0px 15px rgba(253, 35, 92, 0.5)' : null,
    }
  },
}))
