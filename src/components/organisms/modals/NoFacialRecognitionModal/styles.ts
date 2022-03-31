import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
  mobile?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    backgroundColor: palette.common.modalBackground,
    color: palette.text.primary,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 8,
    '&:focus': {
      outline: 'none',
    },
    fontSize: '12px',
    padding: spacing(2, 2, 2, 2),
    width: '531px',
  },
  title: {
    width: '100%',
    fontSize: 20,
    padding: spacing(0, 0, 3),
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  radioLabel: {
    fontSize: 16,
  },
  description: {
    padding: spacing(1, 0, 1, 1),
    fontSize: 14,
    maxWidth: '499px',
    lineHeight: 'normal',
  },
  buttons: {
    paddingTop: spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancel: {
    color: palette.primary.main,
    borderRadius: spacing(0.5),
    marginRight: spacing(1),
  },
  submit: ({ darkMode }: StyleArguments) => ({
    // TODO: AMB-2284 ask bonnie about color name stuff
    background: palette.common.buttonBlue,
    color: darkMode ? palette.common.black : palette.common.white,
    borderRadius: spacing(0.5),
    '&:disabled': {
      background: palette.common.grey,
      color: palette.common.black,
    },
  }),
  pauseAlert: {
    display: 'flex',
    paddingTop: spacing(1),
    fontSize: 16,
  },
  close: {
    marginTop: -spacing(0.5),
    cursor: 'pointer',
    '&:hover': {
      color: palette.primary.main,
    },
  },
  pause: {
    paddingLeft: spacing(0.5),
    cursor: 'pointer',
    color: palette.common.buttonBlue,
  },
}))
