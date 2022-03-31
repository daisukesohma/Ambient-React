import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: ({ darkMode, isMini }) => ({
    background: darkMode
      ? theme.palette.common.black
      : theme.palette.common.white,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    boxSizing: 'border-box',
    color: darkMode ? theme.palette.common.white : theme.palette.common.black,
    height: isMini ? 66 : 88,
    padding: isMini ? '12px 8px' : '12px 10px 12px 16px',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  }),
  descriptionBottomRowContainer: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[100] : theme.palette.common.black,
  }),
}))
