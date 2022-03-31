import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
  mobile?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  body: {
    fontSize: 16,
  },
  buttons: {
    paddingTop: spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancel: {
    color: palette.common.buttonBlue,
    borderRadius: spacing(0.5),
    marginRight: spacing(1),
    marginLeft: spacing(1),
    '&:disabled': {
      color: palette.grey[500],
    },
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
}))
