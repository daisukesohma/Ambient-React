import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    background: palette.background.paper,
    padding: spacing(2),
    borderRadius: spacing(1),
    width: '400px',
    border: '1px solid grey',
  },
  a: {
    color: palette.primary.light,
  },
  label: {
    zIndex: 10,
  },
  container: {
    height: '100%',
    width: 'fit-content',
  },
  details: {
    display: 'block',
  },
  detail: {
    display: 'flex',
  },
  detailHeader: {
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
    display: 'flex',
    paddingRight: spacing(1),
    wordBreak: 'keep-all',
  },
}))
