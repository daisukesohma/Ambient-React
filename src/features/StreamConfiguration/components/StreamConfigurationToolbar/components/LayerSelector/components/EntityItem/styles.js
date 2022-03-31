import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  entityItemRoot: ({ isSelected }) => ({
    borderBottom: `1px solid ${palette.text.secondary}`,
    padding: spacing(1, 1, 1, 2),
    background: isSelected ? palette.text.secondary : palette.background.paper,
    '&:hover': {
      background: palette.text.secondary,
    },
    cursor: 'pointer',
  }),
}))
