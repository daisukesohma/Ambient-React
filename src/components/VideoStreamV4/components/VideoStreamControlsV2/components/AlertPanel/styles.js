import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  alertDetailsWrapper: {
    margin: spacing(1, 2, 0, 2),
    display: 'flex',
  },

  names: {
    width: '80%',
  },
  moreOptions: {
    paddingRight: spacing(4),
    paddingTop: spacing(1),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  tabs: {
    width: '100%',
    marginBottom: spacing(2),
  },

  tab: {
    display: 'none',
  },

  activeTab: {
    display: 'block',
    height: 'calc(100% - 230px)',
  },

  tabTitle: {
    width: '33%',
    minWidth: '33%',
    padding: spacing(0.5),
  },

  detailsContainer: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: spacing(1),
    },
    padding: spacing(0, 1),
  },

  roundedWrapper: {
    borderRadius: spacing(0.5),
    overflow: 'hidden',
    marginLeft: spacing(0.5),
    marginRight: spacing(0.5),
  },

  mapWrapper: {
    width: 'calc(100% - 12px)',
    height: 350,
    marginLeft: spacing(),
    marginRight: spacing(0.5),
  },

  timelineWrapper: {
    width: '100%',
    boxSizing: 'border-box',
  },

  sectionTitleSpacing: {
    margin: spacing(1, 2, 1, 1),
  },
  sectionTop: {
    marginTop: spacing(3),
  },
  responderListContainer: {
    height: 'calc(50% - 40px)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: spacing(1),
    },
    marginBottom: spacing(2),
  },

  controlsWrapper: {
    width: '100%',
  },
}))
