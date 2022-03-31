import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import clsx from 'clsx'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const propTypes = {
  loading: PropTypes.bool,
  count: PropTypes.number,
}

function ForensicsLoadingResultCount({ loading, count }) {
  const classes = useStyles()
  const flexClasses = useFlexStyles()

  return (
    <div className={clsx('am-subtitle2', classes.root)}>
      {!loading && count === 0 && <span>No results</span>}
      {!loading && count ? <span>{count} results</span> : null}
      {loading && (
        <span
          className={clsx(
            flexClasses.row,
            flexClasses.centerStart,
            classes.loadingContainer,
          )}
        >
          <span className={classes.loadingIcon}>
            <CircularProgress size={14} />
          </span>
          <span>Loading</span>
        </span>
      )}
    </div>
  )
}

ForensicsLoadingResultCount.propTypes = propTypes

export default ForensicsLoadingResultCount
