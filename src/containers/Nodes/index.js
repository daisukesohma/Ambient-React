import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { DataTable, MoreOptionMenu, CircularProgress } from 'ambient_ui'
import { isMobile } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams, useHistory } from 'react-router-dom'
import get from 'lodash/get'
import LinearProgress from '@material-ui/core/LinearProgress'
import semver from 'semver'

import { arrayGroupBy } from '../../utils'
import {
  fetchSitesByAccountRequested,
  fetchNodeStatisticsByAccountRequested,
} from '../../redux/site/actions'
import { NodeRequestTypeEnum, NodeRequestStatusEnum } from '../../enums'
import allNodesByAccount from '../../selectors/sites/allNodesByAccount'
import TableCell from '../../components/Table/Cell'
import PageTitle from '../../components/Page/Title'

import {
  CREATE_NODE_REQUEST,
  GET_LATEST_NODE_PACKAGE_METADATA,
  GET_NODE_REQUEST_STATUS_BY_ACCOUNT,
} from './common/gql/node'
import AlertDialog from './components/MuiAlertDialog'
import NodeRequestStatus from './components/NodeRequestStatus'
import NodeUpgradeSummary from './components/NodeUpgradeSummary'
import NodeUpgradeButton from './components/NodeUpgradeButton'
import {
  formatMetadata,
  isNodeVersionConfigMonitorEnabled,
  isNodeVersionUpgradeable,
} from './common/utils'
import { renderHealth, renderStorage } from './components/NodeTable'

const POLL_INTERVAL = 30000

function Nodes({ isInternal }) {
  const { palette } = useTheme()
  const history = useHistory()
  const dispatch = useDispatch()
  const { account } = useParams()
  const [restartPendingOnNode, setRestartPendingOnNode] = useState(undefined)
  const [isRestartAlertOpen, setIsRestartAlertOpen] = useState(false) // do we show warning?
  const [upgradeableCount, setUpgradeableCount] = useState(0) // quick summary value
  const sitesState = useSelector(state => state.site)
  const nodes = useSelector(allNodesByAccount)
  const nodeStatistics = useSelector(state => get(state, 'site.nodeStatistics'))

  // NOTE: if sites length is zero, this will continuously dispatch
  useEffect(() => {
    if (sitesState.collection.length === 0) {
      dispatch(fetchSitesByAccountRequested(account))
    }
    if (account) {
      dispatch(fetchNodeStatisticsByAccountRequested(account))
    }
    // eslint-disable-next-line
  }, [dispatch, account])

  // FUTURE @ERIC: This should be global data loaded in first reducer calls
  // Then we can message about version updates, and not have to make this call on this page every time.
  // Since, it's basically "static" data
  // TODO: Poll? Once every 10-30 minutes? Ask Deepak about how often this will change
  //
  const [metadata, setMetadata] = useState(undefined) // Node Package Metadata
  const { data: metadataData } = useQuery(GET_LATEST_NODE_PACKAGE_METADATA)

  // Calculate summary of Nodes that are upgradeable
  useEffect(() => {
    if (nodes && get(metadata, 'version')) {
      const count = nodes.filter(n => {
        if (n.buildVersion) {
          return (
            isNodeVersionConfigMonitorEnabled(n.buildVersion) &&
            isNodeVersionUpgradeable(n.buildVersion, metadata.version)
          )
        } // filter based on result of if its upgradeable
        return false // if no build version or configmonitor is not enabled, don't count
      }).length

      setUpgradeableCount(count)
    }
  }, [nodes, metadata])

  // Node Request
  const [createNodeRequest] = useMutation(CREATE_NODE_REQUEST)

  useEffect(() => {
    if (get(metadataData, 'getLatestNodePackageMetadata')) {
      setMetadata(formatMetadata(metadataData.getLatestNodePackageMetadata))
    }
    // eslint-disable-next-line
  }, [metadataData])

  // Set NodeToRequestMap
  // We grouped by requestType within each nodeId key
  // nodeToRequestMap example object is ie.
  // {
  //     nodeIdKey: {
  //       RESTART: [{ id, status }],
  //       UPGRADE: [{ id, status }]
  //     }
  // }
  //
  const [nodeToRequestMap, setNodeToRequestMap] = useState(undefined)
  const {
    data: nodeRequestData,
    refetch: nodeRequestRefetch, // https://www.apollographql.com/docs/react/data/queries/
  } = useQuery(GET_NODE_REQUEST_STATUS_BY_ACCOUNT, {
    variables: { accountSlug: account },
    pollInterval: POLL_INTERVAL,
  })

  useEffect(() => {
    if (nodes && get(nodeRequestData, 'getNodeRequestStatusByAccount')) {
      const NODE_IDENTIFIER = 'NODE_IDENTIFIER'

      // Intermediate representation
      const requests = nodeRequestData.getNodeRequestStatusByAccount.map(r => {
        const enhanced = { ...r }
        enhanced[NODE_IDENTIFIER] = r.node.identifier // Put identifier at top level
        return enhanced
      })

      // First grouping by Node Identifier
      //  grouped =  {
      //    acme: [{ id, requestType, status, createdTs}, { ... }],
      // }
      const groupedByNodeId = arrayGroupBy(NODE_IDENTIFIER)(requests) // grouped requests by Node identifier

      const map = {}
      Object.keys(groupedByNodeId).forEach(nodeId => {
        map[nodeId] = arrayGroupBy('requestType')(groupedByNodeId[nodeId])
      })
      setNodeToRequestMap(map)
    }
    // eslint-disable-next-line
  }, [nodeRequestData])

  // Create Node Request object and mutate gql
  //
  const initializeRestartOnNode = nodeIdentifier => {
    const nodeRequestInput = {
      request: JSON.stringify({}),
      requestType: NodeRequestTypeEnum.RESTART,
      nodeIdentifier,
    }

    createNodeRequest({
      variables: {
        data: nodeRequestInput,
      },
    })

    nodeRequestRefetch() // update data and UI
  }

  const handleRestartAccept = () => {
    if (restartPendingOnNode) {
      initializeRestartOnNode(restartPendingOnNode) // send Node Request
      setIsRestartAlertOpen(false) // close modal
      setRestartPendingOnNode(undefined) // clear pending node
    }
  }

  const handleRestartClose = () => {
    setIsRestartAlertOpen(false)
  }

  function createData(node, site) {
    return { node, site }
  }

  const rows = nodes ? nodes.map(node => createData(node, node.site)) : []

  const handleRestartClick = nodeIdentifier => () => {
    setIsRestartAlertOpen(true)
    setRestartPendingOnNode(nodeIdentifier)
  }

  const RestartNodeButton = ({ nodeIdentifier }) => {
    return (
      <div
        style={{ cursor: 'pointer', color: '#337ab7' }}
        onClick={handleRestartClick(nodeIdentifier)}
      >
        Restart Service
      </div>
    )
  }

  const getRestartRequestComponent = nodeIdentifier => {
    let requestStatus
    let visible = false
    const restartType = NodeRequestTypeEnum.RESTART

    const requests = get(
      nodeToRequestMap,
      `[${nodeIdentifier}][${restartType}]`,
    )
    if (requests) {
      const lastRequest = requests && requests[requests.length - 1] // assumes last in array is the latest one (or we can SORT by createdTs)
      if (
        lastRequest.status === NodeRequestStatusEnum.INCOMPLETE ||
        lastRequest.status === NodeRequestStatusEnum.INPROGRESS
      ) {
        // only show status if incomplete or inprogress, if complete, don't show
        visible = true
        requestStatus = (
          <NodeRequestStatus
            type={restartType}
            status={lastRequest.status}
            incompleteLabel='Service restart about to begin'
            inprogressLabel='Service restart in progress'
          />
        )
      }
    }

    return {
      visible,
      component: requestStatus,
    }
  }

  /* eslint-disable react/prop-types */
  function renderActions({ node, site }) {
    const restartComponent = {
      visible: isNodeVersionConfigMonitorEnabled(node.buildVersion),
      component: <RestartNodeButton nodeIdentifier={node.identifier} />,
    }
    const restartRequestComponent = getRestartRequestComponent(node.identifier)

    let menuItems = [
      {
        label: 'Start Stream Discovery',
        onClick: () => {
          history.push(
            `/accounts/${account}/infrastructure/discovery/create?site=${site.slug}&node=${node.identifier}`,
          )
        },
      },
    ]

    if (isInternal) {
      menuItems = [
        ...menuItems,
        {
          // to deprecate
          label: 'View Request Status',
          onClick: () =>
            history.push(
              `/accounts/${account}/infrastructure/sites/${site.slug}/appliances/${node.identifier}/status`,
            ),
        },
        {
          // to deprecate
          label: 'Add Cameras',
          onClick: () =>
            history.push(
              `/accounts/${account}/sites/infrastructure/${site.slug}/appliances/${node.identifier}/cameras/config`,
            ),
        },
      ]
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {restartRequestComponent.visible
            ? restartRequestComponent.component
            : isInternal &&
              restartComponent.visible &&
              restartComponent.component}
          <MoreOptionMenu menuItems={menuItems} noBackground />
        </div>
      </>
    )
  }
  /* eslint-enable react/prop-types */

  const getUpgradeRequestComponent = nodeIdentifier => {
    let requestStatus
    let visible = false
    const upgradeType = NodeRequestTypeEnum.UPGRADE

    const requests = get(
      nodeToRequestMap,
      `[${nodeIdentifier}][${upgradeType}]`,
    )
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

  /* eslint-disable react/prop-types */
  const renderVersionWithData = packageMetadata => rowData => {
    const { node } = rowData
    const { buildVersion } = node

    const versionComponent = {
      visible: semver.valid(buildVersion),
      component: <TableCell>v{buildVersion}</TableCell>,
    }
    const upgradeRequestComponent = getUpgradeRequestComponent(node.identifier)
    const upgradeButtonComponent = {
      visible:
        get(packageMetadata, 'version') &&
        isNodeVersionUpgradeable(buildVersion, packageMetadata.version) &&
        isNodeVersionConfigMonitorEnabled(node.buildVersion),
      component: (
        <NodeUpgradeButton
          nodeIdentifier={node.identifier}
          refetch={nodeRequestRefetch}
          metadata={packageMetadata}
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
  /* eslint-enable react/prop-types */

  const columns = [
    {
      title: 'Appliance',
      field: 'node.name',
      render: row => <TableCell>{get(row, 'node.name')}</TableCell>,
    },
    {
      title: 'Site',
      field: 'site.name',
      render: row => <TableCell>{get(row, 'site.name')}</TableCell>,
    },
    {
      title: 'Version',
      render: renderVersionWithData(metadata),
    },
    {
      title: 'Storage',
      render: renderStorage(nodeStatistics), // NOTE: will want to test this with real systemHealth data and ensure table reloads
    },
    {
      title: 'Health',
      render: renderHealth(nodeStatistics),
    },
    {
      title: 'Actions',
      render: renderActions,
    },
  ]

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          marginBottom: 20,
        }}
      >
        <PageTitle title='Appliances' />
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: 10, marginBottom: isMobile ? 5 : 0 }}>
            {get(metadata, 'version') && (
              <div style={{ fontWeight: 600, color: palette.grey[700] }}>
                Latest Version: v{metadata.version}
              </div>
            )}
          </div>
          <NodeUpgradeSummary
            upgradeableCount={upgradeableCount}
            total={nodes.length}
          />
        </div>
      </div>
      {sitesState.loading && <LinearProgress />}
      {rows && (
        <DataTable
          title={<div />}
          columns={columns}
          data={rows}
          localization={{
            body: {
              emptyDataSourceMessage: sitesState.loading ? (
                <div>
                  <span style={{ marginRight: 24 }}>
                    Loading appliance data
                  </span>
                  <CircularProgress />
                </div>
              ) : (
                'No results'
              ),
            },
            toolbar: {
              searchPlaceholder: 'Search Appliances',
            },
          }}
          options={{
            paging: false,
            search: true,
            searchFieldAlignment: 'left',
            searchFieldStyle: {
              minWidth: 250,
              fontSize: 16,
            },
          }}
        />
      )}
      <AlertDialog
        acceptClick={handleRestartAccept}
        acceptText='Restart'
        handleClose={handleRestartClose}
        open={isRestartAlertOpen}
        title={`Restart Node "${
          restartPendingOnNode
            ? nodes.find(n => n.identifier === restartPendingOnNode).name
            : ''
        }"?`}
        content='This will result in up to 1 minute downtime.'
      />
    </div>
  )
}

Nodes.defaultProps = {
  isInternal: false,
}

Nodes.propTypes = {
  isInternal: PropTypes.bool,
}

export default Nodes
