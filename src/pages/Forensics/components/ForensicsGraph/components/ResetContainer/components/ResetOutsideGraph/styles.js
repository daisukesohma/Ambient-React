import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  resetButton: {
    fill: palette.background.levels[1],
    cursor: 'pointer',
  },
  innerCircle: {
    fill: palette.background.levels[1],
  },
}))
