import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  modal: ({ darkMode }) => ({
    border: `1px solid ${palette.text.secondary}`,
    left: '30%',
    minWidth: 420,
    padding: spacing(3),
    position: 'absolute',
    top: '10%',
    width: '25%',
  }),
  title: ({ darkMode }) => ({
    color: palette.text.secondary,
  }),
  inputText: ({ darkMode }) => ({
    color: `${palette.text.secondary} !important`,
  }),
}))
