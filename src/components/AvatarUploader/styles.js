import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  avatarContainer: {
    position: 'relative',
    borderRadius: '50%',
    minWidth: 150,
    minHeight: 150,
    maxWidth: 150,
    maxHeight: 150,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    background: palette.primary[500],
  },
  deleteBtn: {
    position: 'absolute',
    display: 'flex',
    padding: 4,
    right: '3px',
    bottom: '20px',
    backgroundColor: palette.common.black,
    borderRadius: '50%',
    cursor: 'pointer',
  },
  avatarOverlay: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: '50%',
  },
  avatarOverlayPlaceholder: {
    background: `linear-gradient(135deg, ${palette.primary.main} 20%, ${palette.error.main} 50%, ${palette.common.tertiary}) 70%`,
  },
  avatarOverlayOpacity: {
    background: 'rgba(0,0,0,.4)',
  },
  uploadText: {
    '&:hover': {
      color: palette.secondary.main,
    },
  },
}))
