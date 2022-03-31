import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  modalContainer: ({ showForensicsPanel }) => ({
    gridArea: showForensicsPanel ? '1/1/1/20' : '1/1/1/26',
    overflowY: 'hidden',
    overflowX: 'hidden',
  }),
  hoverBg: ({ showForensicsPanel, userActive }) => ({
    position: 'absolute',
    zIndex: 9,
    width: '100%',
    top: 0,
    height: 72,
    gridArea: showForensicsPanel ? '1/1/1/20' : '1/1/1/26',
    background: userActive ? 'rgba(0,0,0,.32)' : 'transparent',
  }),
}))
