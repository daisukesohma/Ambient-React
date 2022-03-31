import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'

export default withStyles(({ palette }) => ({
  root: {
    color: palette.grey[500],
    '&$checked': {
      color: palette.common.greenPastel,
    },
  },
  checked: {},
}))(props => <Checkbox size='small' color='default' {...props} />)
