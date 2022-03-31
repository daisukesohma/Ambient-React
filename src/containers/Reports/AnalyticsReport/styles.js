import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  textColor: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  dividerColor: ({ darkMode }) => ({
    width: 'calc(100% + 32px)',
    marginLeft: -16,
    backgroundColor: darkMode ? palette.common.white : palette.common.black,
  }),
  stickyHeader: {
    width: '100%',
    position: 'sticky',
    top: 0,
    paddingTop: 8,
    zIndex: 1,
    backgroundColor: '#f3f3f4',
  },
}))
