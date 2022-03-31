import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  dialogRoot: ({ darkMode }) => ({
    background: darkMode ? palette.common.black : null,
  }),
  dialogTitleRoot: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : null,
    borderBottom: darkMode ? `1px solid ${palette.grey[800]}` : null,
  }),
  dialogContentRoot: {
    padding: spacing(1, 3, 0.5),
  },
  dialogContentTextRoot: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : null,
  }),
  dialogActionsRoot: {
    padding: spacing(3),
    justifyContent: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50% -75%)',
  },
  multiSelect: {
    color: palette.common.black,
    paddingTop: spacing(1),
  },
  dropdown: {
    paddingTop: spacing(1),
  },
  title: {
    padding: spacing(1),
  },
}))
