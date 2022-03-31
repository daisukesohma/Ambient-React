import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  darkMode: boolean
  lightIcon: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  iconContainer: ({ darkMode }: StyleProps) => ({
    marginTop: -spacing(1),
    color: darkMode ? palette.grey[500] : palette.grey[700],
    '&:hover': {
      color: darkMode ? palette.common.white : palette.common.black,
    },
  }),
  root: {
    width: '100%',
  },
}))
