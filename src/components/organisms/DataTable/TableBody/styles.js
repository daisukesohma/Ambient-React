import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  flexContainer: {
    display: 'flex',
  },
  actionItem: {
    paddingRight: 15,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  tableRowContainer: ({ darkMode }) => ({
    '&:hover': {
      background: darkMode ? palette.grey[800] : palette.primary[50],
    },
  }),
  tableRowContainerNoHover: {
    '&:hover': {
      background: 'inherit',
    },
  },
  root: ({ darkMode, isMobileOnly }) => ({
    borderBottom: `1px solid ${palette.grey[darkMode ? 800 : 200]}`,
    // color: darkMode ? palette.common.white : palette.grey[800],
    padding: isMobileOnly ? spacing(1) : spacing(2),
  }),
  body: {
    fontSize: 14,
  },
}))
