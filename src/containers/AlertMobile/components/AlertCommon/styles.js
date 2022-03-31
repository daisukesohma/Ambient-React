import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  fullWidth: {
    width: '100%',
  },
  evidence: {
    height: 'fit-content',
    backgroundColor: '#fbd138 !important',
  },
  goLiveButton: {
    right: spacing(4),
  },
  optionMenu: {
    paddingTop: spacing(3),
    paddingRight: spacing(3),
  },
  titleRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
}))