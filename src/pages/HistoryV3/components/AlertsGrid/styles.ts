import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    background: palette.background.layer[1],
    borderRadius: 8,
    width: '100%',
    '& .slider': {
      height: '100%',
      opacity: 1,
    },
    '& .carousel': {
      height: '100%',
    },
  },
  highlight: {
    color: palette.error.main,
  },
}))
