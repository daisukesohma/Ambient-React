import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export default makeStyles(theme => ({
  modalVideoV2: {
    position: 'absolute',
    border: `1px solid ${theme.palette.grey[100]}`,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    flexDirection: 'column',
    maxHeight: '100%',
    color: ({ darkMode }: StyleArguments) =>
      darkMode ? theme.palette.common.white : 'inherit',
    '&::-webkit-scrollbar': {
      width: 8,
    },
    backgroundColor: ({ darkMode }: StyleArguments) =>
      darkMode ? '#000' : 'rgba(0,0,0,.95)',
    padding: 0,
    height: '100%',
    top: 0,
    left: 0,
    transform: 'unset',
    overflowY: 'hidden',
    overflowX: 'hidden',
    width: '100% !important',
    display: 'grid',
    gridTemplateColumns: 'repeat(25, 1fr)',
  },
}))
