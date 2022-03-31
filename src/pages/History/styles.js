import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    // color: darkMode ? palette.common.white : palette.common.black,
    // backgroundColor: darkMode ? palette.common.black : palette.common.white,
  }),
  mobileTabs: {
    marginTop: 24,
  },
  filterRoot: ({ darkMode }) => ({
    minHeight: 74,
    alignItems: 'flex-start',
    // color: darkMode ? palette.common.white : palette.common.black,
    // backgroundColor: darkMode ? palette.common.black : palette.common.white,
  }),
  newIndicator: {
    backgroundColor: '#ed5565',
    left: 0,
    right: 'auto',
    marginTop: -2,
    marginLeft: -spacing(1),
  },
  alertFilter: {
    marginRight: spacing(3),
  },
  listViewIndicator: ({ isGridView }) => ({
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: spacing(0.5),
    padding: spacing(0.5),
    cursor: 'pointer',
    // background: isGridView ? 'white' : 'black',
    // color: isGridView ? 'black' : 'white',
    marginRight: spacing(0.5),
  }),
  gridViewIndicator: ({ isGridView }) => ({
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: spacing(0.5),
    padding: spacing(0.5),
    cursor: 'pointer',
    // background: isGridView ? 'black' : 'white',
    // color: isGridView ? 'white' : 'black',
  }),
  alertPanel: {
    padding: spacing(0, 1),
    margin: spacing(1, 0),
  },
  tabWrapper: {
    flexDirection: 'row',
  },
  tabRoot: {
    minWidth: 150,
  },
  tabContainer: {
    paddingBottom: spacing(2),
    width: '100%',
  },
}))

export default useStyles
