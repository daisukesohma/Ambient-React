import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    height: '100%',
    background: palette.grey[800],
    position: 'relative',
  },

  topPanelControls: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    width: 'calc(100% - 8px)',
    zIndex: 1,
  },

  videoBox: {
    height: '100%',
    background: palette.common.black,
  },

  dropBox: {
    height: '100%',
    color: palette.grey[500],
  },

  vmsModalIcon: ({ selectedStream }) => ({
    height: 24,
    cursor: selectedStream ? 'pointer' : 'not-allowed',
    backgroundColor: palette.grey[800],
    borderRadius: 2,
  }),

  placeholder: {
    color: palette.grey[500],
  },
}))
