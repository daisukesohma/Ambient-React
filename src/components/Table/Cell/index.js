import React from 'react'
import PropTypes from 'prop-types'

import useCommonStyles from 'common/styles/useCommonStyles'

TableCell.propTypes = {
  children: PropTypes.node,
}

export default function TableCell({ children }) {
  const commonStyles = useCommonStyles()

  return <div className={commonStyles.cellTextNormal}>{children}</div>
}
