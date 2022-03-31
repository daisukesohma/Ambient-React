import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useTheme } from '@material-ui/core/styles'
import { CircularProgress } from 'ambient_ui'
import { Icon as IconKit } from 'react-icons-kit'
import { refreshCcw } from 'react-icons-kit/feather/refreshCcw'
import clsx from 'clsx'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

function RefreshTableData({ handleFetch }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const lastFetch = useSelector(state => state.cameras.streamsHealthUpdatedTs)
  const isLoading = useSelector(state => state.cameras.streamsHealthLoading)
  const hasData = useSelector(state => state.cameras.streamsHealth)

  // hasData is used to conditionally show the Loading and Refresh icons
  // only when data is in the table, ie. after the initial load of data
  //
  return (
    <div
      className={clsx(flexClasses.row, flexClasses.centerStart)}
      id='refresh-icon'
    >
      {hasData && !isLoading && (
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
      {hasData && isLoading && (
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
