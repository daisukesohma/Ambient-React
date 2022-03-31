import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  image: {
    maxHeight: 'inherit',
  },
  imageStage: {
    border: `1px solid ${palette.common.black}`,
    cursor: 'crosshair',
    overflow: 'hidden',
  },
  imageContainer: {
    paddingRight: spacing(1),
  },
}))
