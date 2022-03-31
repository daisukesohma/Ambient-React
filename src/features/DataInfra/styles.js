import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  bottomPanel: {
    display: 'flex',
    width: '100vw',
  },
  mainPanel: ({ darkMode }) => ({
    width: '100%',
    height: 'calc(100% - 136px)', // - height of header and bottom HistoryPanel
    overflowY: 'auto',
    borderTop: `1px solid ${
      darkMode ? palette.grey[800] : palette.common.black
    }`,
  }),
}))
