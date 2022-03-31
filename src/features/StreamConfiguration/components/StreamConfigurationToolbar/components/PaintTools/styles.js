import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, palette }) => ({
  brushContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: spacing(0.5),
    marginLeft: spacing(1),
  },
  brush: {
    background: palette.grey[700],
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: '50%',
    margin: 2,
  },
  brushSelected: {
    background: hexRgba(palette.grey[500], 0.16),
  },
  individualBrushSizeContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(0.5),
    height: 80,
    borderRadius: 4,
    border: `1px solid ${hexRgba(palette.grey[800], 0.2)}`,
    '&:hover': {
      background: hexRgba(palette.grey[800], 0.5),
    },
  },
}))
