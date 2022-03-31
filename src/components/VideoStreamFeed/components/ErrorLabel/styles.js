import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    position: 'relative',
    width: '100%',
  },
  labelContainer: {
    background: hexRgba(palette.error.main, 0.8),
    padding: spacing(1),
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 9,
  },
  label: {
    color: palette.common.white,
  },
}))
