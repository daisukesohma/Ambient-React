import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

const LEFT = 125
export default makeStyles(({ spacing, palette }) => ({
  backgroundContainer: {
    background: hexRgba(palette.common.black, 0.94),
    borderRadius: spacing(0.5),
    position: 'absolute',
    left: LEFT,
    bottom: spacing(1),
  },
  icon: {
    border: `1px solid transparent`,
  },
  selectedIcon: {
    border: `1px solid ${hexRgba(palette.primary.main, 0.7)}`,
  },
  selectedBar: {
    borderRadius: 2,
    height: 2,
    margin: '4px auto 0px',
    width: '70%',
  },
  root: {
    bottom: 136,
    color: 'white',
    display: 'grid',
    left: LEFT + spacing(2),
    margin: spacing(0.5),
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
  rowSpacing: {
    marginBottom: spacing(0.5),
  },
}))
