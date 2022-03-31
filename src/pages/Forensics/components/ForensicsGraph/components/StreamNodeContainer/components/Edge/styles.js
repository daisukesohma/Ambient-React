import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  edge: ({ hasResults, fill }) => ({
    opacity: hasResults ? 1 : 0.1,
    transition: 'opacity .8s',
    stroke: fill,
    strokeWidth: 1,
  }),
}))
