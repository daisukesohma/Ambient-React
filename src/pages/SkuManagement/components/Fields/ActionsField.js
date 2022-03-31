import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
// src
import { MoreOptionMenu } from 'ambient_ui'
import { useFlexStyles } from 'common/styles/commonStyles'

import useMenuItems from '../../hooks/useMenuItems'

const propTypes = {
  rowData: PropTypes.object,
}

const ActionsField = ({ rowData }) => {
  const { node, handleOpen } = rowData
  const [menuItems] = useMenuItems({ node, handleOpen })
  const darkMode = useSelector(state => state.settings.darkMode)
  const flexClasses = useFlexStyles()

  if (isEmpty(menuItems)) return null

  return (
    <>
      <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
        <MoreOptionMenu
          menuItems={menuItems}
          noBackground
          darkMode={darkMode}
        />
      </div>
    </>
  )
}

ActionsField.propTypes = propTypes

export default ActionsField
