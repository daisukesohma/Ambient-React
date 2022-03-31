import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  AlertModalLayout: {
    width: '100%',
  },
  AlertModalLayoutTitle: ({ isMobile }) => ({
    margin: spacing(0.5),
    marginTop: isMobile ? spacing(3) : 'unset',
  }),
  AlertModalLayoutDispatchInfo: {
    marginTop: spacing(1),
    marginBottom: spacing(1),
    textAlign: 'center',
  },
  AlertModalLayoutDivider: {
    width: '100%',
  },
  AlertModalLayoutColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0px 2px 0px 2px',
  },
  AlertModalLayoutTimelineColumn: {
    backgroundColor: 'white',
    height: '100%',
    padding: '5px 2px 0px 2px',
  },
  clipContainer: {
    display: 'flex',
    alignItems: 'center',
    background: 'black',
  },
  rowGrid: {
    marginBottom: spacing(1),
  },
  responderListContainer: {
    maxHeight: 300,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: spacing(1),
    },
  },
  sectionTitle: {
    marginBottom: spacing(1),
  },
}))
