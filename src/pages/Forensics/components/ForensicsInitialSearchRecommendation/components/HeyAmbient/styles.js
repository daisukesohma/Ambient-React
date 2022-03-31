import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  caption: {
    marginLeft: spacing(1),
  },
  titleContainer: {
    marginTop: spacing(8),
    marginBottom: spacing(2),
  },
  trailsText: {
    position: 'relative',
    width: '100%',
    height: '40px',
    lineHeight: '40px',
    color: palette.primary.main,
    fontSize: '1.3em',
    fontWeight: '500',
    willChange: 'transform, opacity',
    overflow: 'hidden',
  },
  main: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
