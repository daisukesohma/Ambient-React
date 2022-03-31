import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  line: ({ color }) => ({
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: 'round',
  }),
}))

export default useStyles
