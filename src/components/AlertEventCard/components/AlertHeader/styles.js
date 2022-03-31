import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  headerLine: {
    width: '100%',
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    marginTop: spacing(1),
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  primaryText: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    // display: 'flex',
    // justifyContent: 'space-between',
    // width: '100%',
  }),
  secondaryText: ({ darkMode }) => ({
    color: darkMode ? palette.grey[500] : palette.grey[700],
  }),
  iconContainer: {
    marginLeft: spacing(-0.5),
    marginRight: spacing(0.5),
  },
  draggableContainer: {
    marginTop: spacing(-1),
  },
  moreOptions: {
    paddingTop: spacing(0.375),
    paddingRight: spacing(2),
  },
}))
