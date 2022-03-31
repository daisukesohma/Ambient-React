import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  darkMode: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  optionsContainer: {
    padding: '0 8px',
  },
  option: ({ darkMode }: StyleProps) => ({
    padding: spacing(0.5),
    color: palette.grey[darkMode ? 50 : 800],
    fontSize: 12,
    cursor: 'pointer',
    '&:hover': {
      color: darkMode ? palette.secondary.main : palette.common.tertiary,
      background: palette.grey[darkMode ? 700 : 200],
    },
    outline: 'none',
  }),
}))
