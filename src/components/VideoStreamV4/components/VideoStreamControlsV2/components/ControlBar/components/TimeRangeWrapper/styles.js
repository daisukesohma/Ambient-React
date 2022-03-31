import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  labelContainer: {
    position: 'absolute',
    bottom: 140,
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: 'fit-content',
    color: palette.primary[500],
    borderRadius: spacing(0.5),
  },
  saveButton: {
    margin: spacing(0, 1, 0, 2),
  },
  closeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: '50%',
    width: 12,
    height: 12,
  },
  label: {
    padding: spacing(0.5, 1),
  },
}))
