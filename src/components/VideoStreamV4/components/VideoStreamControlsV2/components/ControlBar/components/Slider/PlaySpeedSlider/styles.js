import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    marginRight: spacing(2),
    color: palette.common.white,
  },
  sliderContainer: {
    margin: spacing(0, 1),
    width: spacing(20),
  },
  sliderContainerPortrait: {
    margin: spacing(0, 0.5),
    width: 100,
  },
  speed: {
    color: palette.primary[500],
  },
}))
