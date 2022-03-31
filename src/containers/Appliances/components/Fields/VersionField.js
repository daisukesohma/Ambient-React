import React from 'react'
import PropTypes from 'prop-types'
import semver from 'semver'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
// src
import TableCell from 'components/Table/Cell'
import { NodeRequestTypeEnum, NodeRequestStatusEnum } from 'enums'
import formatNodeRequestData from 'selectors/appliances/formatNodeRequestData'
import { fetchNodeRequestStatusByAccountRequested } from 'redux/slices/appliances'

import NodeUpgradeButton from '../NodeUpgradeButton'
import NodeRequestStatus from '../NodeRequestStatus'
import {
  isNodeVersionConfigMonitorEnabled,
  isNodeVersionUpgradeable,
} from '../../common/utils'

const getUpgradeRequestComponent = (
  nodeIdentifier,
  metadata,
  nodeToRequestMap,
) => {
  let requestStatus
  let visible = false
  const upgradeType = NodeRequestTypeEnum.UPGRADE

  const requests = get(nodeToRequestMap, `[${nodeIdentifier}][${upgradeType}]`)
  if (requests) {
    const lastRequest = requests && requests[requests.length - 1] // assumes last in array is the latest one (or we can SORT by createdTs)
    if (
      lastRequest.status === NodeRequestStatusEnum.INCOMPLETE ||
      lastRequest.status === NodeRequestStatusEnum.INPROGRESS
    ) {
      // only show status if incomplete or inprogress, if complete, don't show
      visible = true
      const inprogressLabel = get(metadata, 'version')
        ? `Upgrade to v${metadata.version} in progress`
        : 'Upgrade in progress'

      requestStatus = (
        <NodeRequestStatus
          type={upgradeType}
          status={lastRequest.status}
          incompleteLabel='Appliance upgrade about to begin'
          inprogressLabel={inprogressLabel}
        />
      )
    }
  }

  return {
    visible,
    component: requestStatus,
  }
}

const propTypes = {
  metadata: PropTypes.any, // TODO: check by original author
  rowData: PropTypes.any, // TODO: check by original author
  darkMode: PropTypes.bool,
}

const VersionField = ({ metadata, rowData, darkMode }) => {
  const dispatch = useDispatch()
  const nodeToRequestMap = useSelector(formatNodeRequestData)
  const { node } = rowData
  const { buildVersion } = node
  const { account } = useParams()

  const nodeRequestRefetch = () => {
    dispatch(fetchNodeRequestStatusByAccountRequested({ accountSlug: account }))
  }

  const versionComponent = {
    visible: semver.valid(buildVersion),
    component: <TableCell>v{buildVersion}</TableCell>,
  }
  const upgradeRequestComponent = getUpgradeRequestComponent(
    node.identifier,
    metadata,
    nodeToRequestMap,
  )
  const upgradeButtonComponent = {
    visible:
      get(metadata, 'version') &&
      isNodeVersionUpgradeable(buildVersion, metadata.version) &&
      isNodeVersionConfigMonitorEnabled(node.buildVersion),
    component: (
      <NodeUpgradeButton
        nodeIdentifier={node.identifier}
        refetch={nodeRequestRefetch}
        metadata={metadata}
      />
    ),
  }

  return (
    <>
      {versionComponent.visible && versionComponent.component}
      {upgradeRequestComponent.visible && (
        <span style={{ marginLeft: 8 }}>
          {upgradeRequestComponent.component}
        </span>
      )}
      {!upgradeRequestComponent.visible && upgradeButtonComponent.visible && (
        <span style={{ marginLeft: 16 }}>
          {upgradeButtonComponent.component}
        </span>
      )}
    </>
  )
}

VersionField.propTypes = propTypes

export default VersionField
