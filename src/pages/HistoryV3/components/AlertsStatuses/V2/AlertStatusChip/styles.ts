import { makeStyles } from '@material-ui/core/styles'

export default makeStyles({
  root: {
    borderColor: ({ color } : { color: string }) => color,
    height: 24,
  },
  label: {
    color: ({ color } : { color: string }) => color,
  },
})
