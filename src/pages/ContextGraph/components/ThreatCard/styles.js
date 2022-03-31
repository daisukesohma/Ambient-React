import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  tsAlertRegionName: {
    textDecorationLine: 'underline',
  },
  listItem: ({ disableBottomBorder, darkMode }) => ({
    lineHeight: '1.8',
    paddingBottom: '0px',
    '&&': {
      cursor: 'pointer',
      boxSizing: 'border-box',
      borderBottom: disableBottomBorder
        ? 'none'
        : `1px solid ${palette.grey[700]}`,
    },
    '&.active': {
      backgroundColor: darkMode ? palette.grey[800] : palette.grey[300],
    },
  }),
}))
