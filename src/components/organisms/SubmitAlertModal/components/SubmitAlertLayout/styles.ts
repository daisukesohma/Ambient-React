import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
  mobile?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  textField: {
    // TODO: AMB-2284 ask bonnie about color name stuff
    background: palette.common.inputGrey,
    borderRadius: spacing(0.5),
    padding: spacing(0, 1, 0, 1),
    width: '100%',
    '&:hover': {
      outline: 'none',
    },
  },
  requiredLine: {
    display: 'flex',
    paddingBottom: spacing(1),
    fontSize: 12,
  },
  required: {
    color: palette.error.main,
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
    alignItems: 'center',
  },
  radioButton: {
    color: palette.text.primary,
  },
  checked: {
    color: palette.common.buttonBlue,
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
