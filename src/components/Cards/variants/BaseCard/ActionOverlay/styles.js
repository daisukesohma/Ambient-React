import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  layoutContainer: ({ isHorizontalLayout }) => ({
    display: 'flex',
    flexDirection: isHorizontalLayout ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    opacity: 1,
    zIndex: 9999,
  }),
  oneContainer: ({ isButtonType, isHorizontalLayout }) => ({
    marginBottom: isButtonType && !isHorizontalLayout ? 15 : 0,
    marginRight: isButtonType && isHorizontalLayout ? 20 : 0,
  }),
  panelContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
  },
  panelOneContainer: {
    background: 'rgba(35,253,140, .2)',
    borderTopLeftRadius: 4,
    '&:hover': {
      background: 'rgba(35,253,140, .6)',
    },
    width: '100%',
    height: '100%',
  },
  panelTwoContainer: {
    background: 'rgba(253, 35, 92, .2)',
    borderTopRightRadius: 4,
    '&:hover': {
      background: 'rgba(253, 35, 92, .6)',
    },
  },
}))
