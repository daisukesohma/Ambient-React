import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  paperRoot: ({ darkMode }) => ({
    background: darkMode ? palette.common.black : palette.common.white,
  }),
  table: ({ darkMode }) => ({
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    background: darkMode ? palette.common.black : palette.common.white,
  }),
  empty: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: ({ darkMode }) => ({
    textAlign: 'center',
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  alertPanel: {
    width: '100%',
    boxSizing: 'border-box',
    padding: spacing(0, 1),
  },
  alertText: {
    fontSize: 12,
    lineHeight: '16px',
  },
}))
