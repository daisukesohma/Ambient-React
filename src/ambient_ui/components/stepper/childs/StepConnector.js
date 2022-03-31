import { withStyles } from '@material-ui/core/styles'
import MuiStepConnector from '@material-ui/core/StepConnector'

export default withStyles(({ palette }) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: palette.primary.main,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: palette.primary.main,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: palette.grey[200],
    borderRadius: 1,
  },
}))(MuiStepConnector)
