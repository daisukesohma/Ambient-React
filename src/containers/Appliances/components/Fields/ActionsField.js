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
}

// import formatNodeRequestData from 'selectors/appliances/formatNodeRequestData'
// import { NodeRequestTypeEnum, NodeRequestStatusEnum } from 'enums'

// import NodeRequestStatus from '../NodeRequestStatus'
// import {
//   isNodeVersionConfigMonitorEnabled
// } from '../../common/utils'
//
// const getRestartRequestComponent = (nodeIdentifier, nodeToRequestMap) => {
//   let requestStatus
//   let visible = false
//   const restartType = NodeRequestTypeEnum.RESTART
//
//   const requests = get(
//     nodeToRequestMap,
//     `[${nodeIdentifier}][${restartType}]`,
//   )
//   if (requests) {
//     const lastRequest = requests && requests[requests.length - 1] // assumes last in array is the latest one (or we can SORT by createdTs)
//     if (
//       lastRequest.status === NodeRequestStatusEnum.INCOMPLETE ||
//       lastRequest.status === NodeRequestStatusEnum.INPROGRESS
//     ) {
//       // only show status if incomplete or inprogress, if complete, don't show
//       visible = true
//       requestStatus = (
//         <NodeRequestStatus
//           type={restartType}
//           status={lastRequest.status}
//           incompleteLabel={'Service restart about to begin'}
//           inprogressLabel={`Service restart in progress`}
//         />
//       )
//     }
//   }
//
//   return {
//     visible,
//     component: requestStatus,
//     // component: null
//   }
// }

// const RestartNodeButton = ({ nodeIdentifier, handleRestartClick }) => {
//   return (
//     <div
//       style={{ cursor: 'pointer', color: '#337ab7' }}
//       onClick={handleRestartClick(nodeIdentifier)}
//     >
//       Restart Service
//     </div>
//   )
// }

const ActionsField = ({ rowData, handleRestartClick }) => {
  const { node, site } = rowData
  const [menuItems] = useMenuItems({ node, site })
  const darkMode = useSelector(state => state.settings.darkMode)
  const flexClasses = useFlexStyles()
  // const nodeToRequestMap = useSelector(formatNodeRequestData)

  // const restartComponent = {
  //   visible: isNodeVersionConfigMonitorEnabled(node.buildVersion),
  //   component: <RestartNodeButton nodeIdentifier={node.identifier} handleRestartClick={handleRestartClick}/>,
  //   // component: null
  // }
  //
  // const restartRequestComponent = getRestartRequestComponent(node.identifier, nodeToRequestMap)

  return (
    <>
      <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
        {/* restartRequestComponent.visible
          ? restartRequestComponent.component
          :
            restartComponent.visible &&
            restartComponent.component */}
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
