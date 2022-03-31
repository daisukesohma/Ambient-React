import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, palette }) => ({
  iconContainer: {
    border: `1px solid ${hexRgba(palette.primary[500], 0.32)}`,
    padding: spacing(1, 1, 1, 1.25),
    margin: -2,
    marginTop: -232,
    borderRadius: 4,
  },
}))
