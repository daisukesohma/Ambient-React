import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiTab from '@material-ui/core/Tab'

export default withStyles(({ palette }) => ({
  root: {
    textTransform: 'none',
    fontSize: 14,
    fontFamily: `'Aeonik-Regular'`,
    color: palette.grey[700],
    backgroundColor: palette.common.white,
    opacity: 1,
    borderLeft: `1px solid ${palette.grey[100]}`,
    borderRight: `1px solid ${palette.grey[100]}`,
    '&:hover': {
      fontWeight: 900,
      backgroundColor: palette.grey[50],
    },
    '&$selected': {
      fontWeight: 900,
      backgroundColor: palette.grey[50],
      boxShadow: `0 0 10px ${palette.grey[400]}`,
      zIndex: 10,
    },
  },
  selected: {},
}))(props => <MuiTab disableRipple {...props} />)
