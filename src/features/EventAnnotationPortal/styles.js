import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  container: ({ darkMode }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: darkMode ? palette.common.black : palette.grey[300],
  }),
  bottomPanel: ({ darkMode }) => ({
    display: 'flex',
    width: '100vw',
    background: darkMode ? palette.common.black : palette.grey[100],
  }),
  mainPanel: ({ darkMode }) => ({
    width: '100%',
    height: 'calc(100% - 136px)', // - height of header and bottom HistoryPanel
    background: darkMode ? palette.common.black : palette.grey[300],
    overflowY: 'auto',
    borderTop: `1px solid ${
      darkMode ? palette.grey[800] : palette.common.black
    }`,
  }),
}))
