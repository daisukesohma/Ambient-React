import React, { useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import { useAbility } from '@casl/react'
// src
import { DropdownMenu, SettingsOptionMenu } from 'ambient_ui'
import DataTable from 'components/organisms/DataTable'
import PageTitle from 'components/Page/Title'
import {
  setProvisionNewModalValue,
  fetchSkusRequested,
  SkuReducerProps,
} from 'pages/SkuManagement/redux'
import { createNotification } from 'redux/slices/notifications'
import AddModal from 'pages/SkuManagement/components/AddModal'
import { AbilityContext } from 'rbac'

import allInventory from './selectors/allInventory'
import {
  fetchInventoryRequested,
  fetchProvisionStatusesRequested,
  fetchAmbientOsRequested,
  setEditModalValue,
  InventoryReducerProps,
} from './redux'
import RefreshTableData from './components/RefreshTableData'
import EditModal from './components/EditModal'
import AddButton from './components/AddButton'
import AmbientOsModal from './components/AmbientOsModal'
import useTableData from './hooks/useTableData'
import statusDropDownOptions from './selectors/statusDropDownOptions'

function Inventory(): JSX.Element {
  const { palette } = useTheme()
  const ability = useAbility(AbilityContext)
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const isEditOpen = useSelector(
    (state: InventoryReducerProps) => state.inventory.editModal.isOpen,
  )
  const { isOpen: isAmbientOsModalOpen } = useSelector(
    (state: InventoryReducerProps) => state.inventory.ambientOsModal,
  )

  const provisionStatuses = useSelector(
    statusDropDownOptions([
      (state: InventoryReducerProps) =>
        get(state, 'inventory.provisionStatuses', []),
    ]),
  )
  const allProvisionStatuses = [
    { label: 'All Statuses', value: { id: null } },
    ...provisionStatuses,
  ]

  const isProvisionNewModalOpen = useSelector(
    (state: SkuReducerProps) => state.skuManagement.provisionNewModal.isOpen,
  )

  const nodes = useSelector(allInventory)

  const {
    columns,
    limit,
    isLoading,
    setLimit,
    setPage,
    page,
    pages,
    totalCountOverride,
    setSearchQuery,
    setNodeProvisionStatus,
    selectedProvisionStatus,
  } = useTableData()

  const fetchInventory = () => {
    dispatch(
      fetchInventoryRequested({
        filters: {
          nodeProvisionStatus: selectedProvisionStatus.id,
        },
        page,
        limit,
      }),
    )
  }

  useEffect(() => {
    fetchInventory()
    dispatch(fetchProvisionStatusesRequested())
  }, []) // eslint-disable-line

  const handleRowClick = row => {
    const nodeId = get(row, 'node.id')
    dispatch(
      setEditModalValue({
        id: nodeId,
        isOpen: true,
      }),
    )
  }

  const handleSearch = query => {
    setSearchQuery(query)
  }

  const handleSelection = e => {
    setPage(0)
    setNodeProvisionStatus(e.value)
  }

  function createData(node) {
    return { node }
  }

  const rows = nodes ? nodes.map(node => createData(node)) : []

  const additionalTools = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 16 }}>
        <RefreshTableData handleFetch={fetchInventory} />
      </span>
      <span style={{ marginRight: 16 }}>
        <DropdownMenu
          menuItems={allProvisionStatuses}
          selectedItem={allProvisionStatuses.find(
            item => item.value.id === selectedProvisionStatus.id,
          )}
          handleSelection={handleSelection}
        />
      </span>
      {ability.can('create', 'NodeProvision') && (
        <span style={{ marginRight: 16, marginTop: 3 }}>
          <AddButton
            handleClick={() => {
              dispatch(fetchSkusRequested())
              dispatch(setProvisionNewModalValue({ isOpen: true, tabIndex: 0 }))
            }}
          />
        </span>
      )}
    </div>
  )

  const getDownloadLink = () => {
    if (ability.can('download', 'AmbientOs')) {
      dispatch(fetchAmbientOsRequested())
    } else {
      dispatch(
        createNotification({
          message: 'You do not have permission to download Ambient OS',
        }),
      )
    }
  }

  const settingsMenuOptions = [
    {
      label: 'Download AmbientOS',
      value: 'downloadIso',
      onClick: getDownloadLink,
      hoverColor: palette.secondary.main,
    },
  ]

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
        <PageTitle title='Inventory' darkMode={darkMode} />
        <div>
          <SettingsOptionMenu
            menuItems={settingsMenuOptions}
            darkMode={darkMode}
            textClass='am-caption'
          />
        </div>
      </div>
      <div>
        {rows && (
          <DataTable
            additionalTools={additionalTools}
            columns={columns}
            darkMode={darkMode}
            data={rows}
            defaultRowsPerPage={limit}
            isLoading={isLoading}
            isPaginated
            onClickRow={handleRowClick}
            onSearch={query => handleSearch(query)}
            rowsPerPage={limit}
            serverSideProcessing
            page={page - 1}
            pages={pages}
            setPage={setPage}
            setRowsPerPage={setLimit}
            showAddNowButton={false}
            totalCountOverride={totalCountOverride}
          />
        )}
      </div>
      <AddModal open={isProvisionNewModalOpen} />
      <EditModal open={isEditOpen} />
      <AmbientOsModal open={isAmbientOsModalOpen} />
    </div>
  )
}

export default Inventory
