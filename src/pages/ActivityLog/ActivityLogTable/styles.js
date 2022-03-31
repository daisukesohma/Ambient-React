import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    '& .slider': {
      height: '100%',
      opacity: 1,
    },
    '& .carousel': {
      height: '100%',
    },
  },
  wrapper: {
    width: 'calc(100% + 22px)',
  },
  editBtn: {
    color: palette.primary.main,
    cursor: 'pointer',
  },
  date: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    marginRight: 8,
  }),
  text: ({ darkMode }) => ({
    color: darkMode ? palette.grey[100] : palette.grey[700],
  }),
}))
