import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  root: ({ color, width, opacity, height }) => ({
    left: 0,
    width,
    opacity,
    height,
    background: color,
  }),
  slanted: {
    transform: 'skew(-25deg, 0)',
  },
}))
