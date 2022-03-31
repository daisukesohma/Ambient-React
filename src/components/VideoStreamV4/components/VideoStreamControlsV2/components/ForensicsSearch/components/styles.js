import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  containerRoot: ({ isMobileOnly }) => ({
    width: isMobileOnly ? '100%' : 'auto',
  }),
}))

export default useStyles
