import React from 'react'
import PropTypes from 'prop-types'
import SimpleLabel from 'components/Label/SimpleLabel'

import useStyles from './styles'

const Sites = ({ site }) => {
  const classes = useStyles()

  return (
    <div>
      {site && (
        <div className={classes.chip}>
          <SimpleLabel inlineTooltip toolTipWidth='fit-content'>
            {site.name}
          </SimpleLabel>
        </div>
      )}
    </div>
  )
}

Sites.defaultProps = {
  site: {},
}

Sites.propTypes = {
  site: PropTypes.object,
}

export default Sites
