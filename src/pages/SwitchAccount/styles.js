import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette, spacing }) => ({
  container: {
    backgroundColor: palette.background.paper,
  },
  maxHeight: {
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: spacing(3, 0, 0, 3),
    transition: 'background 10ms cubic-bezier(1,0,0,1) 0ms',
    '&:hover': {
      background: palette.grey[800],
    },
  },
}))
