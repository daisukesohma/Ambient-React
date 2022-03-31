import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    height: '100%',
  },
  headerBar: {
    display: 'flex',
    flexDirection: 'row',
  },
  contentContainer: {
    padding: '0 50px',
    height: '95%',
    justifyContent: 'center',
  },
  headerContainer: {
    paddingTop: 22,
    paddingBottom: 16,
    height: 'fit-content',
  },
  mainContainer: {
    paddingBottom: 35,
    height: 'fit-content',
  },
}))
