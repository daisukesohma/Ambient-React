import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  modal: ({ darkMode }) => ({
    background: darkMode ? palette.grey[900] : palette.common.white,
    border: `1px solid ${palette.grey[700]}`,
    left: '25%',
    padding: spacing(3),
    position: 'absolute',
    top: '10%',
    width: '50%',
    maxHeight: '80%',
    overflowY: 'auto',
    outline: 'none',
  }),
  filterContainer: {
    margin: spacing(1.5, 0),
  },
  filterLabel: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    marginRight: spacing(1),
  }),
  viewSwitcher: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: spacing(1),
    cursor: 'pointer',
  },
  switchRoot: ({ isMobile }) => ({
    display: 'flex',
    marginTop: isMobile ? spacing(1) : 0,
  }),
  chipRoot: ({ isMobile }) => ({
    cursor: 'pointer',
    margin: isMobile ? spacing(1, 0.5) : spacing(0, 0.5),
  }),
  resetText: {
    color: palette.primary[300],
  },
}))
