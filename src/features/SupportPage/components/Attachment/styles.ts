import { makeStyles } from '@material-ui/core/styles'
import hexRgba from 'utils/styles/hexRgba'

interface StyleArguments {
  darkMode: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    fontSize: '12px',
    padding: spacing(1, 1, 1, 1),
    display: 'flex',
    width: 'fit-content',
  }),
  close: ({ darkMode }: StyleArguments) => ({
    background: darkMode ? palette.grey[700] : palette.common.white,
    padding: 0,
    border: '1px solid transparent',
    '&:hover': {
      background: hexRgba(palette.common.black, 0.97),
    },
  }),
  name: {
    paddingRight: 4,
  },
}))
