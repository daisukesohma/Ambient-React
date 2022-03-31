import { makeStyles } from '@material-ui/core/styles'

const CELL_HEIGHT = 48
const CELL_WIDTH_LARGE = 72
const CELL_WIDTH = 40
const CELL_WIDTH_SMALL = 28

export default makeStyles(({ spacing, palette }) => ({
  root: {
    userSelect: 'none',
    width: 300,
    position: 'relative',
    border: `1px solid ${palette.grey[800]}`,
  },
  centerBar: {
    position: 'absolute',
    height: '100%',
    left: '50%',
    top: 0,
    width: 1,
    background: palette.primary[500],
  },

  container: {
    width: '100%',
    cursor: 'pointer',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'center'
  },

  textField: {
    color: palette.common.white,
  },

  dayCell: {
    padding: spacing(1),
    height: CELL_HEIGHT,
    width: CELL_WIDTH_LARGE,
    display: 'inline-block',
    background: palette.grey[900],
    border: `.5px solid ${palette.grey[800]}`,
    color: palette.common.white,
  },
  cellText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  displayDateContainer: {
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: palette.grey[900],
    padding: spacing(0.5),
  },
  hourCell: {
    padding: spacing(1),
    height: CELL_HEIGHT,
    width: CELL_WIDTH,
    display: 'inline-block',
    background: palette.grey[900],
    border: `.5px solid ${palette.grey[800]}`,
    color: palette.common.white,
  },

  minuteCell: {
    padding: spacing(1),
    height: CELL_HEIGHT,
    width: CELL_WIDTH_SMALL,
    display: 'inline-block',
    background: palette.grey[900],
    border: `.5px solid ${palette.grey[800]}`,
    color: palette.common.white,
  },
  motionBar: {
    height: 4,
    width: CELL_WIDTH,
    marginTop: 32,
    borderRadius: 4,
    background: palette.common.tertiary,
  },
  motionBarSmall: {
    height: 4,
    width: CELL_WIDTH_SMALL,
    marginTop: 32,
    borderRadius: 4,
    background: palette.common.tertiary,
  },
  highlightedCell: {
    opacity: 0.6,
    background: palette.primary.main,
  },

  disabledCell: {
    background: palette.grey[700],
  },
}))
