import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  wrapper: ({ darkMode }) => ({
    // backgroundColor: darkMode ? palette.common.black : palette.common.white,
    // color: darkMode ? palette.common.white : palette.common.black,
    display: 'flex',
  }),
  hintBlock: {
    marginLeft: 20,
  },
  hint: {
    color: palette.grey[500],
  },

  box: {
    display: 'inline-block',
    cursor: 'pointer',
    height: 48,
    marginLeft: 10,
  },

  checkboxLabel: {
    marginLeft: 8,
  },

  templateContainerScrollWrapper: {
    position: 'absolute',
    display: 'block',
    width: 'calc(100% - 340px)',
    padding: '0 15px',
    left: 330,
  },

  templateContainer: {
    position: 'relative',
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    scrollBehavior: 'smooth',
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
    background: darkMode ? palette.grey[800] : palette.common.white,

    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
    transform: 'translateY(-50%)',
  }),

  templateContent: {
    width: 700,
  },

  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 18,
  },
}))
