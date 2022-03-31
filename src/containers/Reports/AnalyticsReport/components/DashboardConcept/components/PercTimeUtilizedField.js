import React from 'react'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'

import useStyles from '../../MetricTable/styles'

const propTypes = {
  value: PropTypes.number,
}

function PercTimeUtilizedField({ value }) {
  const classes = useStyles()
  return (
    <Box display='flex' flexDirection='row' justifyContent='center'>
      <Box
        pl={1}
        pr={1}
        pt={0.5}
        pb={0.5}
        className={
          value > 70 ? classes.compareIncrease : classes.compareDecrease
        }
        borderRadius={8}
      >
        {value}%
      </Box>
    </Box>
  )
}

PercTimeUtilizedField.propTypes = propTypes

export default PercTimeUtilizedField
