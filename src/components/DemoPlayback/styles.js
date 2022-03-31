import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  drawer: ({ expandPlayback }) => ({
    opacity: 0.95,
    paddingTop: '4px',
    boxShadow: '1px 1px 10px 2px #797979',
    bottom: expandPlayback ? 0 : -38,
  }),
  stepper: {
    padding: '2px',
  },
  badge: {
    bottom: '6px',
  },
  nextStepButton: {
    backgroundColor: ({ darkMode }) =>
      darkMode ? palette.grey[500] : '#efdada',
  },
  step: {
    '& > .MuiStepConnector-root': {
      top: '5px !important',
    },
  },
  stepLabel: {
    fontSize: '14px',
    marginTop: '3px !important',
    textTransform: 'none',
  },
  playButton: {
    fontSize: '0px',
    bottom: '7px',
  },
  nextStep: {
    color: 'red',
  },
  displayController: {
    width: 36,
    height: 36,
    color: palette.common.white,
    backgroundColor: palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute',
    right: 8,
    borderRadius: '50%',
    boxShadow: 'rgba(34, 36, 40, 0.2) 0px 2px 6px',
    bottom: '24px',
    zIndex: 1,
  },
}))
