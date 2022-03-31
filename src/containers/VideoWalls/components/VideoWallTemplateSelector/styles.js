import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  wrapper: ({ darkMode }) => ({
    height: 100,
    backgroundColor: darkMode
      ? theme.palette.common.black
      : theme.palette.common.white,
    color: darkMode ? theme.palette.common.white : theme.palette.common.black,
  }),
  hintBlock: {
    boxSizing: 'border-box',
    padding: '22px 0px 22px 23px',
    marginRight: 30,
    width: 160,
  },
  hint: {
    color: theme.palette.grey[500],
  },

  checkboxLabel: {
    marginLeft: 8,
  },

  templateContainerScrollWrapper: {
    position: 'relative',
    display: 'block',
    width: 'calc(100% - 515px)',
    marginRight: 30,
    padding: '0 15px',
  },

  templateContainer: {
    position: 'relative',
    display: 'block',
    width: '100%',
    overflow: 'hidden',
  },

  templateContainerScrollIndicator: ({ darkMode }) => ({
    zIndex: 1,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    left: 0,
    top: '50%',
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: darkMode ? theme.palette.grey[800] : theme.palette.common.white,

    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
    transform: 'translateY(-50%)',
  }),

  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 18,
  },
}))
