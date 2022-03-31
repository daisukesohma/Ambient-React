import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    marginBottom: spacing(1),
    borderBottom: `1px solid ${palette.text.secondary}`,
    boxShadow: 'none',
    borderRadius: 0,
    '&:hover': {
      background: palette.text.secondary,
    },
  },
  cardContent: {
    paddingTop: spacing(1),
    paddingLeft: spacing(3),
  },
  cardActions: {
    paddingLeft: spacing(3),
  },
}))
