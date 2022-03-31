import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'ambient_ui'
import PropTypes from 'prop-types'

import useStyles from './styles'

function Region({ data }) {
  const { palette } = useTheme()
  const classes = useStyles()
  return (
    <span className={classes.regionContainer}>
      <span className={classes.icon}>
        <Icon
          icon='compass'
          size={18}
          color={palette.primary[300]}
          style={{ transform: 'translate(-2px, 4px)' }}
        />
      </span>
      {data}
    </span>
  )
}

Region.propTypes = {
  data: PropTypes.string,
}
export default Region
