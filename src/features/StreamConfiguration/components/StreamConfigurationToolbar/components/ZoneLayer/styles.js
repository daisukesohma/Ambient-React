import { makeStyles } from '@material-ui/core/styles'
import get from 'lodash/get'
import { hexRgba } from 'utils'

export default makeStyles(({ palette }) => ({
  box: ({ isActiveZone }) => ({
    '&:hover': {
      background: palette.grey[500],
    },
    background: isActiveZone ? hexRgba(palette.primary[500], 0.16) : 'inherit',
  }),
  zoneLine: {
    cursor: 'pointer',
  },
  zoneCircle: ({ zone, isActiveZone }) => {
    const color = get(zone, 'color', palette.grey[50])
    return {
      background: isActiveZone ? hexRgba(color, 0.8) : 'transparent',
      border: `2px solid ${hexRgba(color, isActiveZone ? 0.8 : 0.5)}`,
      width: 16,
      height: 16,
    }
  },
}))
