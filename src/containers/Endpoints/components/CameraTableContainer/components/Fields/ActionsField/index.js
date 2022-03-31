import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
// src
import { useFlexStyles } from 'common/styles/commonStyles'

import ViewCamera from './components/ViewCamera'
// import ExtraMenu from './components/ExtraMenu'

const propTypes = {
  rowData: PropTypes.object,
}

function ActionsField(rowData) {
  const flexClasses = useFlexStyles()
  return (
    <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
      <ViewCamera rowData={rowData} />
      {/* <ExtraMenu /> */}
    </div>
  )
}

ActionsField.propTypes = propTypes

export default ActionsField
