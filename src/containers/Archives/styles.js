import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  archiveFooter: {
    padding: spacing(2),
  },
  media: {
    width: '100%',
    height: 'auto',
    flex: 10,
  },
  header: {
    display: 'flex',
    padding: '16px 0px 16px 0px',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 10,
  },
  dropdown: {
    marginLeft: -10,
  },
  label: ({ darkMode }) => ({
    '&&': {
      fontSize: 16,
      fontFamily: '"Aeonik-Regular", "Roboto"',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: 0.5,
      color: palette.grey[darkMode ? 200 : 700],
    },
  }),
  table: {
    padding: 16,
  },
  iconBtn: {
    color: palette.error.main,
  },
  deleteSpan: {
    marginLeft: 5,
  },
  cardRoot: ({ darkMode }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: `1px solid ${palette.grey[500]}`,
    color: darkMode ? palette.grey[100] : palette.common.black,
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
  }),
  cardSubheader: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  cardFlexOne: {
    flex: 1,
  },
  cardContent: ({ darkMode }) => ({
    padding: '2px 5px 2px 5px !important',
    color: darkMode ? palette.grey[100] : palette.common.black,
  }),
  alertMsg: {
    fontSize: 18,
    // marginTop: 40,
  },
  highlight: {
    color: palette.error.main,
  },
}))
