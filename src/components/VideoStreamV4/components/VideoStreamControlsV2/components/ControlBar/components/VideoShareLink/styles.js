import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

const LEFT = 200
const useStyles = makeStyles(theme => ({
  backgroundContainer: {
    background: hexRgba(theme.palette.common.black, 0.94),
    borderRadius: theme.spacing(0.5),
    position: 'absolute',
    left: LEFT,
    bottom: theme.spacing(1),
  },
  caption: {
    color: theme.palette.grey[500],
  },
  icon: {
    border: `1px solid transparent`,
  },
  selectedIcon: {
    border: `1px solid ${hexRgba(theme.palette.primary.main, 0.7)}`,
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
    left: LEFT + theme.spacing(2),
    margin: theme.spacing(0.5),
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
  rowSpacing: {
    marginBottom: theme.spacing(0.5),
  },
}))

export default useStyles
