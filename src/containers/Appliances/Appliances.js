import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'
import { useDispatch, useSelector, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
// src
import DataTable from 'components/organisms/DataTable'
import {
  fetchNodesByAccountRequested,
  fetchNodeStatisticsByAccountRequested,
  fetchNodePackageMetadataRequested,
  fetchNodeRequestStatusByAccountRequested,
  setSerialNumber,
  setAssociateModalValue,
} from 'redux/slices/appliances'
import allNodesByAccount from 'selectors/appliances/allNodesByAccount'
import formatMetadata from 'selectors/appliances/formatMetadata'
import PageTitle from 'components/Page/Title'
import useInterval from 'common/hooks/useInterval'
import AddButton from './components/AddButton'
import AssociateNodeModal from './components/AssociateNodeModal'

import AlertDialog from './components/MuiAlertDialog'
import NodeUpgradeSummary from './components/NodeUpgradeSummary'
import useTableData from './hooks/useTableData'

const POLL_INTERVAL = 30000

export default function Appliances() {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const { account, serialNumber } = useParams()
  const darkMode = useSelector(state => state.settings.darkMode)
  const [restartPendingOnNode, setRestartPendingOnNode] = useState(undefined)
  const [isRestartAlertOpen, setIsRestartAlertOpen] = useState(false) // do we show warning?
  const appliancesState = useSelector(state => state.appliances)
  const associateModalOpen = useSelector(
    state => state.appliances.associateNodeModal.isOpen,
  )
  const nodes = useSelector(allNodesByAccount)
  const metadata = useSelector(formatMetadata) // Node Package Metadata

  const handleRestartClick = nodeIdentifier => () => {
    setIsRestartAlertOpen(true)
    setRestartPendingOnNode(nodeIdentifier)
  }

  const { columns, limit, setLimit } = useTableData({ handleRestartClick })

  useEffect(() => {
    dispatch(setSerialNumber({ serialNumber }))
  }, [dispatch, serialNumber])

  // NOTE: if sites length is zero, this will continuously dispatch
  useEffect(() => {
    dispatch(fetchNodesByAccountRequested({ accountSlug: account }))
    if (account) {
      dispatch(fetchNodeStatisticsByAccountRequested({ accountSlug: account }))
    }

    batch(() => {
      dispatch(fetchNodePackageMetadataRequested())
      dispatch(
        fetchNodeRequestStatusByAccountRequested({ accountSlug: account }),
      )
    })
    // eslint-disable-next-line
  }, [dispatch, account, associateModalOpen])

  const nodeRequestRefetch = () => {
    dispatch(fetchNodeRequestStatusByAccountRequested({ accountSlug: account }))
  }

  // Poll Node Data
  useInterval(() => {
    nodeRequestRefetch()
  }, POLL_INTERVAL)

  const initializeRestartOnNode = nodeIdentifier => {
    // @JASH just comment out create node requested stuff for now
    //
    // const nodeRequestInput = {
    //   request: JSON.stringify({}),
    //   requestType: NodeRequestTypeEnum.RESTART,
    //   nodeIdentifier,
    // }

    // dispatch(nodeCreateRequested(nodeRequestInput))
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

  const closeModal = () => {
    dispatch(setAssociateModalValue({ isOpen: false }))
  }

  function createData(node) {
    return { name: get(node, 'name', null), node }
  }

  const rows = nodes ? nodes.map(node => createData(node)) : []

  const isLoading =
    appliancesState.loading ||
    appliancesState.loadingMetadata ||
    appliancesState.loadingNodeCreation

  const additionalTools = (
    <div style={{ display: 'flex' }}>
      <span
        style={{ marginRight: 16, marginTop: 3 }}
        onClick={() => {
          dispatch(setAssociateModalValue({ isOpen: true }))
        }}
      >
        <AddButton />
      </span>
    </div>
  )

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          marginBottom: 16,
        }}
      >
        <PageTitle title='Appliances' darkMode={darkMode} />
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: 8, marginBottom: isMobile ? 4 : 0 }}>
            {get(metadata, 'version') && (
              <div style={{ fontWeight: 600, color: palette.grey[700] }}>
                Latest Version: v{metadata.version}
              </div>
            )}
          </div>
          <NodeUpgradeSummary />
        </div>
      </div>
      <div>
        {rows && (
          <DataTable
            additionalTools={additionalTools}
            isLoading={isLoading}
            columns={columns}
            darkMode={darkMode}
            data={rows}
            defaultRowsPerPage={limit}
            rowsPerPage={limit}
            setRowsPerPage={setLimit}
            showAddNowButton={false}
            defaultOrder='asc'
          />
        )}
      </div>
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
      <AssociateNodeModal open={associateModalOpen} />
    </div>
  )
}
