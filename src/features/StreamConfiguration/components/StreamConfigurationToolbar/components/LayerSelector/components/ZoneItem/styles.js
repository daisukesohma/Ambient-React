import { makeStyles } from '@material-ui/core/styles'

const ratio = 8
export default makeStyles(({ spacing, palette }) => ({
  zoneContainer: {
    padding: spacing(0, 1, 0, 2),
    margin: spacing(2, 0),
    '&:hover': {
      background: palette.text.secondary,
    },
  },
  zoneImage: {
    boxSizing: 'border-box',
    border: `1px solid ${palette.text.secondary}`,
    width: 640 / ratio,
    height: 480 / ratio,
  },
}))
