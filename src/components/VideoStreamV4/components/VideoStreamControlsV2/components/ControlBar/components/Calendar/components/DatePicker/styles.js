import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  buttonContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: palette.grey[900],
    color: palette.common.white,
  },
  calendarContainer: {
    bottom: 140,
    position: 'absolute',
  },
  cancelButton: {
    padding: spacing(1),
    width: '100%',
    height: '100%',
  },
  goButton: {
    padding: spacing(1),
    width: '100%',
    height: '100%',
  },
  warningBar: {
    padding: 4,
    background: palette.grey[900],
    color: palette.common.greenPastel,
  },
}))
