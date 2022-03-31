import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 4,
    margin: 4,
    backgroundColor: palette.grey[100],
  },
  label: {
    float: 'left',
  },
  chip: {
    maxWidth: '50%',
    display: 'flex',
    '& + div': {
      marginLeft: '5px',
    },
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  labelType: {
    margin: spacing(0, 1),
    padding: spacing(0.25, 1),
    borderRadius: spacing(0.5),
    border: `1px solid ${palette.primary.main}`,
    color: palette.common.white,
    whiteSpace: 'nowrap',
  },
  inlineRoot: {
    margin: 0,
    display: 'flex',
    width: 'fit-content',
  },
  background: {
    backgroundColor: palette.primary.main,
  },
  primary: {
    fontSize: '14px',
  },
}))
