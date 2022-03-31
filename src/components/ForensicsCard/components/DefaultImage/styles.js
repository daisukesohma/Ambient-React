import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: palette.grey[700],
    marginLeft: spacing(1),
  },
  img: {
    width: spacing(3),
    opacity: 0.3,
    marginBottom: spacing(0.5),
  },
}))
