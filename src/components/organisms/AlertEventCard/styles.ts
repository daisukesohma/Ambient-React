import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  carouselWrapper: {
    width: '100%',
    height: '100%',
    '& > div': {
      height: '100%',
    },
    '& .slider-wrapper': {
      height: '100%',
    },
  },
  cardMediaRoot: {
    minHeight: 270,
  },
  root: {
    height: '100%',
    background: palette.background.layer[2],
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  videoIcon: {
    fontSize: 100,
  },
  iconContainer: {
    margin: 'auto',
  },
  cardActionArea: {
    textTransform: 'unset',
  },
  cardContent: {
    paddingBottom: spacing(1),
  },
  cardActions: {
    padding: spacing(2),
    paddingTop: 0,
  },
}))
