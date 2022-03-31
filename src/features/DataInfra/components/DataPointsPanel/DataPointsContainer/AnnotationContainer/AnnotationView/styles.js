import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    display: 'flex',
    flexDirection: 'row',
    background: darkMode ? palette.grey[800] : palette.grey[100],
  }),
  descriptionContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 20,
  },
  eventContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingTop: 25,
    paddingRight: 15,
    paddingBottom: 0,
  },
  labelContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingBottom: 5,
    paddingRight: 10,
  },
  label: {
    color: palette.grey[500],
  },
  value: ({ darkMode }) => ({
    color: darkMode ? palette.grey[600] : palette.common.black,
  }),
  id: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[600],
  }),
  status: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  formControl: {
    margin: spacing(1),
    minWidth: 550,
    maxWidth: 550,
  },
  inputField: {
    color: palette.grey[500],
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '75%',
    transform: 'translate(-50% -75%)',
  },
  videoContainer: {
    height: '100%',
    width: '100%',
  },
  mp4Source: {
    height: '100%',
  },
  gifSource: {
    width: '100%',
    height: '100%',
    display: 'inline',
  },
}))
