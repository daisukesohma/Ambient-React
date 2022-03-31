import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
}

// TODO to break this down as atom styles
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
  body: {
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
    color: palette.common.buttonBlue,
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
  details: {
    fontSize: 12,
    paddingTop: spacing(2),
  },
  detailLabel: {
    paddingBottom: spacing(0.75),
    fontSize: 12,
    lineHeight: '14.4px',
  },
  detail: {
    paddingBottom: spacing(1.375),
    fontSize: 14,
    lineHeight: '16.8px',
  },
  detailsTitle: {
    fontSize: 16,
    paddingBottom: spacing(1),
    fontWeight: 'bold',
  },
}))
