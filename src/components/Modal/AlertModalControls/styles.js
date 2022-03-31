import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  drawer: {
    left: '25%',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
  },
  controller: {
    '&': {
      width: '100%',
      '& >button': {
        width: '100%',
      },
    },
  },
}))
