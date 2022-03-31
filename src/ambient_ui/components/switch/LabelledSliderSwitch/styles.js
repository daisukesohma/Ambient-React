import { makeStyles } from '@material-ui/core/styles'

import { shadows } from '../../../shared/styles'

const borderHeight = 0
const thumbWidth = 82
const thumbHeight = 32

export const useStyles = makeStyles(({ transitions, palette }) => ({
  thumb: {
    width: thumbWidth,
    height: thumbHeight,
    borderRadius: thumbHeight / 2,
  },
  iconColor: {
    background: palette.common.white,
    height: thumbHeight - 2 * borderHeight,
    color: palette.grey[700],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: shadows.hard,
  },
  checkedIconColor: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.common.white,
    backgroundColor: `${palette.grey[700]} !important`,
    border: '0 !important',
    height: `${thumbHeight}px !important`,
    boxShadow: shadows.hard,
  },
  track: {
    borderRadius: (thumbHeight + 2 * borderHeight) / 2,
    border: `${borderHeight}px solid ${palette.grey[500]}`,
    backgroundColor: palette.grey[500],
    opacity: 1,
    boxSizing: 'border-box',
    transition: transitions.create(['background-color', 'border']),
  },
}))
