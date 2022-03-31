import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {},
  container: {
    height: '100%',
    width: 'fit-content',
    paddingTop: spacing(1),
    flexWrap: 'inherit',
  },
  modal: {
    top: '20%',
    width: '75%',
    height: '65%',
    left: '12.5%',
    position: 'absolute',
    background: palette.background.paper,
    outline: 'none',
    padding: spacing(1),
    overflowX: 'auto',
    overflowY: 'hidden',
    borderRadius: spacing(1),
    border: `1px solid ${palette.grey[600]}`,
  },
  image: {
    maxHeight: 'inherit',
  },
  button: {
    alignItems: 'center',
  },
}))
