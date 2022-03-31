import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  video: {
    width: '100%',
    height: '100%',
  },
  buttons: {
    color: palette.primary.main,
    opacity: 0.7,
    '&:hover': {
      opacity: 1.0,
      background: 'transparent !important',
    },
  },
}))
