import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: {
    background: palette.common.black,
    width: '100%',
    height: '100%',
  },
  main: {
    color: palette.primary[300],
    fontWeight: 'bolder',
    fontSize: `128px !important`,
  },
  subText: {
    color: palette.grey[700],
  },
  firstNumber: {
    marginRight: spacing(2),
  },
  logo: {
    marginTop: spacing(1),
    width: 112,
    height: 112,
    cursor: 'pointer',
  },
  lastNumber: {
    marginLeft: spacing(2),
  },
  rotateDiagonal: {
    animation: `$rotate-center 1s ease-in-out infinite both`,
  },
  rotateDiagonalSlow: {
    animation: `$rotate-center 2s ease-in-out infinite both`,
  },
  rotateDiagonalFast: {
    animation: `$rotate-center .6s ease-in-out infinite both`,
  },
  // https://animista.net/play/basic/rotate/rotate-center
  '@keyframes rotate-center': {
    '0%': {
      transform: 'rotate(0)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}))
