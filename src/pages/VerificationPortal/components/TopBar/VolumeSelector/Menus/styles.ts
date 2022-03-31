import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 4,
    padding: '4px 8px',
  },
  item: {
    cursor: 'pointer',
    '&:hover': {
      color: palette.primary.main,
    },
  },
  itemText: {
    marginLeft: spacing(0.5),
  },
}))
