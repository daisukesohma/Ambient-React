import { makeStyles } from '@material-ui/core/styles'

const MIN_WIDTH = 32
const MAX_HEIGHT = 144
const MAX_HEIGHT_MINI = 48
const LOGO_SIZE = 32

export default makeStyles(({ spacing, palette }) => ({
  root: ({ isSelected, isMini }) => ({
    height: '100%',
    width: '100%',
    minWidth: MIN_WIDTH,
    maxHeight: MAX_HEIGHT,
    borderRadius: spacing(0.5),
    margin: isMini ? 0 : spacing(0.5, 1, 0.5, 0),
    border: `2px solid ${
      isSelected ? palette.warning.main : palette.grey[100]
    }`,
    '&:hover': {
      border: `2px solid ${palette.primary[300]}`,
    },
  }),
  img: ({ isMini }) => ({
    maxHeight: isMini ? MAX_HEIGHT_MINI : MAX_HEIGHT,
    padding: isMini ? 0 : spacing(1, 0.5),
    boxSizing: 'border-box',
  }),
  imgTooltip: {
    maxHeight: '100%',
    minWidth: MIN_WIDTH * 2, // make hover larger
  },
  logo: {
    maxHeight: LOGO_SIZE,
    opacity: 0.7,
  },
}))
