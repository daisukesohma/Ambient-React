import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  modal: ({ darkMode }) => ({
    position: 'absolute',
    width: '25%',
    minWidth: 420,
    left: '30%',
    top: '10%',
    // background: darkMode ? palette.grey[900] : palette.common.white,
    padding: spacing(3),
    border: `1px solid ${palette.grey[700]}`,
  }),
  title: ({ darkMode }) => ({
    color: palette.text.secondary,
    marginBottom: `${spacing(3)}px !important`,
  }),
  label: ({ darkMode }) => ({
    color: palette.text.secondary,
    marginRight: spacing(2),
  }),
  value: ({ darkMode }) => ({
    color: palette.text.secondary,
  }),
  renameLabel: {
    marginRight: spacing(3),
  },
  input: {
    marginLeft: spacing(3),
  },
  inputText: ({ darkMode }) => ({
    color: `${palette.text.secondary} !important`,
  }),
}))
