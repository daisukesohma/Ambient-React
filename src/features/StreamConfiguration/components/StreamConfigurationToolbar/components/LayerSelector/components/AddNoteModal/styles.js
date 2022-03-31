import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 300,
    overflowY: 'auto',
    padding: '0 10px',
  },
  controllerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 10,
  },
}))
