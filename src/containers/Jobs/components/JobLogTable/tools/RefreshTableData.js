import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { CircularProgress } from 'ambient_ui'
import { Icon as IconKit } from 'react-icons-kit'
import { refreshCcw } from 'react-icons-kit/feather/refreshCcw'
import clsx from 'clsx'

import {
  useCursorStyles,
  useFlexStyles,
} from '../../../../../common/styles/commonStyles'
import hasJobs from '../../../../../selectors/jobLogs/hasJobs'

import useStyles from './styles'

function RefreshTableData({ handleFetch }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const lastFetch = useSelector(state => state.jobLog.lastUpdatedTs)
  const loading = useSelector(state => state.jobLog.loading)
  const hasData = useSelector(hasJobs)

  // hasData is used to conditionally show the Loading and Refresh icons
  // only when data is in the table, ie. after the initial load of data
  //
  return (
    <div
      className={clsx(flexClasses.row, flexClasses.centerStart)}
      id='refresh-icon'
    >
      {hasData && !loading && (
        <div
          onClick={() => handleFetch()}
          className={clsx(
            cursorClasses.pointer,
            classes.icon,
            classes.iconWrapper,
          )}
        >
          <IconKit icon={refreshCcw} size={14} />
        </div>
      )}
      {hasData && loading && (
        <div style={{ marginRight: 8 }}>
          <CircularProgress />
        </div>
      )}
      {lastFetch && (
        <span className='am-overline' style={{ color: palette.grey[500] }}>
          Last Updated: {moment.unix(lastFetch).format('HH:mm:ss')}
        </span>
      )}
    </div>
  )
}

RefreshTableData.propTypes = {
  handleFetch: PropTypes.func,
}

RefreshTableData.defaultProps = {
  handleFetch: () => {},
}

export default RefreshTableData
