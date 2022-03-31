import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({ r }) => ({
    cursor: 'pointer',
    transition: 'r 0.3s, fill .3s',
    '&:hover': {
      r: r * 1.05,
      fill: palette.error.main,
    },
  }),
  text: {
    cursor: 'pointer',
    transition: 'fill .3s',
    '&:hover': {
      fill: palette.error.main,
    },
  },
}))
