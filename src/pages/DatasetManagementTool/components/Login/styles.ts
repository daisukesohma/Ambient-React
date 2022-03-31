import { makeStyles } from '@material-ui/core/styles'

export interface StyleProps {
  darkMode?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  container: ({ darkMode }: StyleProps) => ({
    width: '100%',
    border: `1px solid ${palette.grey[darkMode ? 800 : 100]}`,
    borderRadius: spacing(0.5),
    outline: 'none',
    '&:hover': {
      background: darkMode ? 'rgba(0,0,0,.3)' : palette.grey[50],
    },
  }),
  input: {
    fontSize: 16,
    padding: spacing(0.5, 1),
    width: '100%',
  },
}))
