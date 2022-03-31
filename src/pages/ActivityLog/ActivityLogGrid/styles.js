import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  root: {
    marginTop: spacing(3),
    width: '100%',
    '& .slider': {
      height: '100%',
      opacity: 1,
    },
    '& .carousel': {
      height: '100%',
    },
  },
  wrapper: {
    width: 'calc(100% + 22px)',
  },
}))
