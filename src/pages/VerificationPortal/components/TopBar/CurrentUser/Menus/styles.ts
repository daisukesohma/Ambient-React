import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    borderRadius: 4,
    padding: '4px 8px',
  },
  item: {
    fontSize: 14,
    padding: '4px 0',
    cursor: 'pointer',
    '&:hover': {
      color: palette.primary.main,
    },
  },
}))
