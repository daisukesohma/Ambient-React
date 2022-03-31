import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  root: {
    '& .MuiBreadcrumbs-ol': {
      alignItems: 'baseline',
    },
  },
  flexItem: {
    display: 'flex',
  },
  breadCrumbsItem: {
    margin: '16px 0',
  },
  link: {
    textDecoration: 'none',
    color: 'unset',
  },
}))
