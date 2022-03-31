import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    width: '60%',
    left: '20%',
    top: '10%',
    // backgroundColor: 'white',
    padding: theme.spacing(3),
  },
}))

export { useStyles }
