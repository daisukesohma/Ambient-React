import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  modalContainer: ({ withSideBar }) => ({
    gridArea: withSideBar ? '1/1/1/20' : '1/1/1/26',
    overflowY: 'hidden',
    overflowX: 'hidden',
  }),
  hoverBg: ({ withSideBar, userActive }) => ({
    position: 'absolute',
    zIndex: 9,
    width: '100%',
    top: 0,
    height: 72,
    gridArea: withSideBar ? '1/1/1/20' : '1/1/1/26',
    background: userActive ? 'rgba(0,0,0,.32)' : 'transparent',
  }),
}))
