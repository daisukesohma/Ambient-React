import { makeStyles } from '@material-ui/core/styles'

export interface StyleProps {
  darkMode?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  container: ({ darkMode }: StyleProps) => ({
    width: '100%',
    background: darkMode ? palette.common.white : palette.common.black,
    border: `1px solid ${palette.grey[darkMode ? 800 : 100]}`,
    borderRadius: spacing(3),
    '&:hover': {
      background: darkMode ? 'rgba(0,0,0,.3)' : palette.grey[50],
      border: darkMode
        ? `1px solid ${palette.grey[100]}`
        : `1px solid ${palette.grey[400]}`,
    },
  }),
  input: {
    fontSize: 16,
    padding: spacing(0.5, 1),
    width: '100%',
  },
  // used  { [classes.darkMode]: darkMode}) syntax because changing color within 'input' and 'container'
  // was having issues when toggling back and fortch between dark and light mode, this is an easier better solution that works every time
  darkMode: {
    color: palette.common.white,
  },
  searchIcon: {
    color: palette.grey[500],
  },
  closeIcon: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}))
