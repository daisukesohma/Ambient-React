import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    background: darkMode ? palette.common.black : palette.common.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    boxSizing: 'border-box',
    color: darkMode ? palette.common.white : palette.common.black,
    display: 'flex',
    flexDirection: 'column',
    height: 54,
    width: '100%',
    marginTop: spacing(1),
  }),
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 170,
  },
}))
