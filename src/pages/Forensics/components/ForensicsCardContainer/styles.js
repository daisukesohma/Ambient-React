import { makeStyles } from '@material-ui/core/styles'

const SNAPSHOT_WIDTH = 185

export default makeStyles(({ spacing, palette }) => ({
  streamContainer: {
    height: 'fit-content',
    width: SNAPSHOT_WIDTH + spacing(4),
    marginRight: spacing(1),
    marginBottom: spacing(2),
    padding: spacing(2),
    boxSizing: 'border-box',
    border: `1px solid ${palette.border.default}`,
    borderRadius: spacing(0.5),
    '&:hover': {
      border: `1px solid ${palette.primary.main}`,
    },
  },
}))
