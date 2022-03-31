// styles.js
import { makeStyles } from '@material-ui/core/styles'

const borderHeight = 0
const thumbWidth = 82
const thumbHeight = 32
const overlapWidth = 6 + 2 * borderHeight
const moveX = thumbWidth - overlapWidth
const totalWidth = thumbWidth * 2 - 6

export const useStyles = makeStyles(({ spacing, transitions, palette }) => ({
  root: {
    width: totalWidth,
    height: thumbHeight + 2 * borderHeight,
    padding: 0,
    margin: spacing(1),
    boxSizing: 'border-box',
    overflow: 'visible',
  },
  switchBase: {
    padding: borderHeight,
    '&$checked': {
      transform: `translateX(${moveX}px)`,
      color: palette.grey[700],
      '& + $track': {
        backgroundColor: palette.grey[500],
        border: `${borderHeight}px solid ${palette.grey[800]}`,
        opacity: 1,
      },
    },
    '&$focusVisible $thumb': {
      color: palette.primary.main,
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: thumbWidth,
    height: thumbHeight,
    borderRadius: thumbHeight / 2,
  },
  track: {
    borderRadius: (thumbHeight + 2 * borderHeight) / 2,
    border: `${borderHeight}px solid ${palette.grey[500]}`,
    backgroundColor: palette.grey[500],
    opacity: 1,
    boxSizing: 'border-box',
    transition: transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))
