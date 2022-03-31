import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  modalPaper: {
    width: ({
      isMobile,
      isConfirm,
      isAlert,
      isVideo,
      isPauser,
      isResponders,
    }) => {
      let width
      if (isVideo) {
        width = isMobile ? '95' : '60%'
      } else {
        width = isConfirm ? '60%' : '80%'
      }
      if (isAlert) {
        width = '90%'
      }
      if (isPauser) {
        width = '60%'
      }
      if (isResponders) {
        width = isMobile ? '100%' : '40%'
      }
      return width
    },
    top: '50%',
    left: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    backgroundColor: ({ isDarkMode, isPauser }) => {
      if (isDarkMode && isPauser) return theme.palette.grey[900]
      if (isDarkMode) return '#000'
      return theme.palette.background.paper
    },
    border: `1px solid ${theme.palette.grey[100]}`,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    padding: theme.spacing(2, 1, 2),
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto',
  },
  darkMode: {
    backgroundColor: '#000',
    color: '#fff',
  },
  // implement with clsx instead so modalPaper doesn't become polluted
  modalVideo: {
    backgroundColor: ({ isDarkMode }) =>
      isDarkMode ? '#000' : theme.palette.background.paper,
    border: 'none',
    borderRadius: 4,
    padding: theme.spacing(2),
    width: '100%',
  },
  modalVideoV2: {
    padding: 0,
    height: '100%',
    top: 0,
    left: 0,
    transform: 'unset',
    overflowY: ({ isMobile }) => (isMobile ? 'auto' : 'hidden'),
    overflowX: 'hidden',
    width: '100% !important',
    display: 'grid',
    gridTemplateColumns: ({ isMobile }) =>
      isMobile ? 'unset' : 'repeat(25, 1fr)',
  },
  modalConfirm: {
    top: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 450,
    border: `1px solid ${theme.palette.grey[100]}`,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 22,
    top: 15,
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
}))
