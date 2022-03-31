import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import { getInfo } from './utils'

TableInfo.propTypes = {
  data: PropTypes.object,
}

TableInfo.defaultProps = {
  data: {},
}

export default function TableInfo({ data }) {
  const { palette } = useTheme()

  if (!data) return null

  return (
    <div className='am-caption' style={{ color: palette.grey[500] }}>
      {getInfo(data)}
    </div>
  )
}
