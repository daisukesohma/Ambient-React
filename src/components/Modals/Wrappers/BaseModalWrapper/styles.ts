import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
  width?: string
  height?: string
}

export default makeStyles(theme => ({
  modalPaper: {
    top: '50%',
    left: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    backgroundColor: ({ darkMode }: StyleArguments) => {
      if (darkMode) return '#000'
      return theme.palette.background.paper
    },
    border: `1px solid ${theme.palette.grey[100]}`,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    padding: theme.spacing(2, 1, 2),
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto',
    color: ({ darkMode }: StyleArguments) =>
      darkMode ? theme.palette.common.white : 'inherit',
    '&::-webkit-scrollbar': {
      width: 8,
    },
    width: ({ width }: StyleArguments) => width || 'fit-content',
    height: ({ height }: StyleArguments) => height || 'fit-content',
  },
}))
