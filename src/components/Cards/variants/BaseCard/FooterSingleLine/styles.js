import { makeStyles } from '@material-ui/core/styles'

export const FOOTER_HEIGHT = 62

export default makeStyles(theme => ({
  root: ({ darkMode, noBorder, height }) => ({
    background: darkMode
      ? theme.palette.common.black
      : theme.palette.common.white,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTop: noBorder ? 'none' : `1px solid ${theme.palette.grey[200]}`,
    bottom: 0,
    boxSizing: 'border-box',
    color: darkMode ? theme.palette.common.white : theme.palette.common.black,
    display: 'flex',
    flexDirection: 'column',
    height: height || FOOTER_HEIGHT,
    justifyContent: 'space-evenly',
    padding: theme.spacing(2),
    position: 'absolute',
    width: '100%',
  }),
  descriptionBottomRowContainer: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[100] : theme.palette.common.black,
  }),
  text: {
    color: theme.palette.grey[700],
  },
}))
