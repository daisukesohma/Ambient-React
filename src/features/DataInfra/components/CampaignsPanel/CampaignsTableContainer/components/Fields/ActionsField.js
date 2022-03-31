import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
// import get from 'lodash/get'
// src
import { MoreOptionMenu } from 'ambient_ui'
import { useFlexStyles } from 'common/styles/commonStyles'

import useMenuItems from '../../hooks/useMenuItems'

const propTypes = {
  rowData: PropTypes.object,
  handleRestartClick: PropTypes.func,
  validActions: PropTypes.array,
  campaignId: PropTypes.number,
}

const ActionsField = ({ campaignId, validActions }) => {
  const [menuItems] = useMenuItems(campaignId, validActions)
  const darkMode = useSelector(state => state.settings.darkMode)
  const flexClasses = useFlexStyles()

  return (
    <>
      {menuItems.length > 0 && (
        <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
          <MoreOptionMenu
            menuItems={menuItems}
            noBackground
            darkMode={darkMode}
          />
        </div>
      )}
    </>
  )
}

ActionsField.propTypes = propTypes

export default ActionsField
