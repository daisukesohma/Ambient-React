import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  loadingContainer: {
    '&&&': {
      // height: 'calc(100% - 34px) !important',
      // padding: 17,
      // backgroundColor: palette.common.white,

      height: '100%',

      display: 'flex',
      borderRadius: 4,
      '& .MuiPaper-root': {
        boxShadow: 'none',
        width: '100%',
        '& >div': {
          marginTop: 20,
        },
      },
      '& h6': {
        margin: 0,
        fontSize: 20,
        fontFamily: "'Aeonik-Light', 'Roboto'",
      },
    },
  },
}))
