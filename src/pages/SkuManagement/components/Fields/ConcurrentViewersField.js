import React from 'react'
import clsx from 'clsx'

import useStyles from './styles'

const ConcurrentViewersField = ({ rowData, darkMode }) => {
  const { node } = rowData
  const classes = useStyles()

  return (
    <div
      className={clsx({
        [classes.statusGreen]: node.status === 'Shipped',
        [classes.statusYellow]: node.status === 'Pending',
        [classes.statusRed]: node.status === 'Inventoried',
      })}
    >
      {node.status}
    </div>
  )
}

export default ConcurrentViewersField
