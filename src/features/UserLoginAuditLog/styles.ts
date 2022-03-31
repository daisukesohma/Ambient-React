import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    top: '50%',
    left: '50%',
    width: '60%',
    height: 'auto',
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    border: `1px solid ${palette.grey[100]}`,
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    padding: spacing(2, 1, 2),
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto',
  }),
  container: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  avatarRow: {
    display: 'flex',
  },
  avatarText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    fontSize: 28,
  },
}))
