import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, palette }) => ({
  backgroundContainer: {
    background: hexRgba(palette.common.black, 0.7),
    padding: spacing(0.5),
    borderRadius: spacing(0.5),
    position: 'absolute',
    right: -125,
    bottom: 8,
  },
  buttonContainer: {
    margin: spacing(0.5, 0),
  },
  icon: {
    border: `1px solid transparent`,
  },
  selectedIcon: {
    border: `1px solid ${hexRgba(palette.primary.main, 0.7)}`,
  },
  selectedBar: {
    margin: '4px auto 0px',
    width: '70%',
    height: 2,
    borderRadius: 2,
  },
  root: {
    zIndex: 0,
    position: 'relative',
    width: '100%',
    bottom: 136,
    right: 125 + 16,
    color: palette.common.white,
    margin: spacing(0.5),
    display: 'grid',
  },
}))
