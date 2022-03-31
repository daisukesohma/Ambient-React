/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import map from 'lodash/map'
import find from 'lodash/find'
import DataTable from 'components/organisms/DataTable'
import DropdownMenu from 'ambient_ui/components/menus/DropdownMenu'
import MultiSelect from 'ambient_ui/components/menus/MultiSelect'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import ConfirmDialog from 'components/ConfirmDialog'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import { SettingsSliceProps } from 'redux/slices/settings'

import {
  setStatusFilter,
  setVerificationTypeFilter,
  AlertInternalSliceProps,
  fetchVerificationTypesRequested,
  fetchThreatSignaturesRequested,
  setThreatSignatureFilters,
  fetchAllAlertsPaginatedRequested,
  setPage,
  setLimit,
  recallAlertToSOCRequested,
  setRecallModalClose,
  setDates,
} from './redux/alertsInternalSlice'
import useStyles from './styles'
import Status from './components/Status'
import Performance from './components/Performance'
import Verification from './components/Verification'
import Actions from './components/Actions'

interface RowData {
  name: string
  id: number
  status: string
  verificationType: string
  severity: string
  dismissedRatio: number
  numPositive: number
  numNegative: number
  signature: string
  performanceMetrics: {
    dismissedRatio: number
    numPositive: number
    numNegative: number
  }
  threatSignature: {
    id: number
    name: string
  }
  site: {
    name: string
    slug: string
    account: {
      name: string
      slug: string
    }
  }
  defaultAlert: {
    threatSignature: {
      id: number
      name: string
    }
    regions: {
      id: number
      name: string
    }[]
  }
  socRecall: {
    tsEnd: number
  }
  canRecall: boolean
}

const columns = [
  {
    title: 'Id',
    field: 'id',
    sorting: false,
  },
  {
    title: 'Name',
    field: 'name',
    sorting: false,
  },
  {
    title: 'Account',
    field: 'accountName',
    sorting: false,
  },
  {
    title: 'Site',
    field: 'siteName',
    sorting: false,
  },
  {
    title: 'Signature',
    field: 'signature',
    sorting: false,
  },
  {
    title: 'Severity',
    field: 'severity',
    sorting: false,
  },
  {
    title: 'Verification Type',
    field: 'verificationType',
    sorting: false,
    render: (rowData: RowData) => {
      return (
        <Verification
          verification={rowData.verificationType}
          socRecall={get(rowData, 'socRecall.tsEnd', null)}
        />
      )
    },
  },
  {
    title: 'Status',
    field: 'status',
    sorting: false,
    render: (rowData: RowData) => {
      return <Status status={rowData.status} />
    },
  },
  {
    title: 'Performance',
    field: 'dismissedRatio',
    sorting: false,
    render: (rowData: RowData) => {
      return (
        <Performance
          dismissedRatio={rowData.dismissedRatio}
          numPositive={rowData.numPositive}
          numNegative={rowData.numNegative}
        />
      )
    },
  },
  {
    title: 'Actions',
    sorting: false,
    render: (rowData: RowData) => {
      return <Actions alertId={rowData.id} canRecall={rowData.canRecall} />
    },
  },
]

export default function AlertsInternal(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode: boolean = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles()
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  const alerts = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.alerts,
  )
  const isLoading = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.loading,
  )
  const totalCount = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.totalCount,
  )
  const pages = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.pages,
  )
  const currentPage = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.page,
  )
  const limit = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.limit,
  )
  const statusFilters = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.statusFilters,
  )
  const verificationTypes = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.verificationTypes,
  )
  const verificationTypeFilter = useSelector(
    (state: AlertInternalSliceProps) =>
      state.alertsInternal.verificationTypeFilter,
  )
  const allThreatSignatures = useSelector(
    (state: AlertInternalSliceProps) =>
      state.alertsInternal.allThreatSignatures,
  )
  const threatSignatureFilters = useSelector(
    (state: AlertInternalSliceProps) =>
      state.alertsInternal.threatSignatureFilters,
  )
  const alertToRecall = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.alertToRecall,
  )
  const recallModalOpened = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.recallModalOpened,
  )
  const recallLoading = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.recallLoading,
  )

  const tsStart = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.tsStart,
  )
  const tsEnd = useSelector(
    (state: AlertInternalSliceProps) => state.alertsInternal.tsEnd,
  )

  const statusOptions = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Test',
      value: 'test',
    },
    {
      label: 'Disabled',
      value: 'disabled',
    },
  ]

  const verificationTypeOptions = [
    {
      label: 'All Verification Types',
      value: null,
    },
    ...verificationTypes,
  ]

  useEffect(() => {
    batch(() => {
      dispatch(fetchVerificationTypesRequested())
      dispatch(fetchThreatSignaturesRequested())
    })
  }, [dispatch])

  useEffect(() => {
    const statuses = map(statusFilters, 'value')
    const threatSignatureIds = map(threatSignatureFilters, 'value')
    const startTs = tsStart === tsEnd ? null : tsStart
    const endTs = tsStart === tsEnd ? null : tsEnd
    dispatch(
      fetchAllAlertsPaginatedRequested({
        searchQuery,
        verificationType: verificationTypeFilter,
        statuses: isEmpty(statuses) ? null : statuses,
        threatSignatureIds: isEmpty(threatSignatureIds)
          ? null
          : threatSignatureIds,
        page: currentPage + 1,
        limit,
        tsStart: startTs,
        tsEnd: endTs,
      }),
    )
  }, [
    dispatch,
    searchQuery,
    statusFilters,
    threatSignatureFilters,
    verificationTypeFilter,
    currentPage,
    limit,
    tsStart,
    tsEnd,
  ])

  const data = map(alerts, instance => {
    return {
      signature: get(instance, 'threatSignature.name', null),
      dismissedRatio: get(instance, 'performanceMetrics.dismissedRatio', null),
      numPositive: get(instance, 'performanceMetrics.numPositive', null),
      numNegative: get(instance, 'performanceMetrics.numNegative', null),
      accountName: get(instance, 'site.account.name', null),
      siteName: get(instance, 'site.name', null),
      ...instance,
    }
  })

  const handleStatusChange = (
    e: {
      label: string
      value: string
    }[],
  ) => {
    dispatch(setStatusFilter({ status: e }))
  }

  const handleThreatSignatureChange = (
    e: {
      label: string
      value: string
    }[],
  ) => {
    dispatch(setThreatSignatureFilters({ threatSignatures: e }))
  }

  const handleVerificationTypeChange = (e: {
    label: string
    value: string | null
  }) => {
    const verificationType = e.value
    dispatch(setVerificationTypeFilter({ verificationType }))
  }

  const handleRecall = () => {
    dispatch(recallAlertToSOCRequested({ alertId: alertToRecall }))
  }

  const handleDateChange = (dates: number[]) => {
    dispatch(setDates({ tsStart: dates[0], tsEnd: dates[1] }))
  }

  const additionalTools = (
    <div className={classes.additionalTools}>
      <DropdownMenu
        handleSelection={handleVerificationTypeChange}
        menuItems={verificationTypeOptions}
        selectedItem={find(verificationTypeOptions, [
          'value',
          verificationTypeFilter,
        ])}
      />
      <div style={{ width: 240 }}>
        <MultiSelect
          className={classes.multiSelect}
          options={allThreatSignatures}
          value={threatSignatureFilters}
          onChange={handleThreatSignatureChange}
          labelledBy='ThreatSignaturesSelector'
          overrideStrings={{
            selectSomeItems: 'Filter Threat Signatures',
            allItemsAreSelected: 'All Threat Signatures Selected',
            selectAll: 'Select All Threat Signatures',
            search: 'Search Threat Signatures',
            clearSearch: 'Clear Threat Signatures',
          }}
          darkMode={darkMode}
        />
      </div>

      <div style={{ width: 160 }}>
        <MultiSelect
          className={classes.multiSelect}
          hasSelectAll={false}
          options={statusOptions}
          value={statusFilters}
          onChange={handleStatusChange}
          labelledBy='StatusFilter'
          disableSearch
          overrideStrings={{
            selectSomeItems: 'Filter Status',
            allItemsAreSelected: 'All Statuses',
            selectAll: 'Select All Statuses',
          }}
          darkMode={darkMode}
        />
      </div>
    </div>
  )

  return (
    <div className={classes.root}>
      <ConfirmDialog
        open={recallModalOpened}
        loading={recallLoading}
        content='Recall this alert to the SOC temporarily?'
        onConfirm={handleRecall}
        onClose={() => dispatch(setRecallModalClose())}
      />
      <div className={classes.datePicker}>
        <Typography className={classes.datePickerLabel}>
          Performance Window
        </Typography>
        <DateTimeRangePickerV3
          darkMode={darkMode}
          startTs={tsStart}
          endTs={tsEnd}
          onChange={handleDateChange}
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        additionalTools={additionalTools}
        isSearchable
        onSearch={(query: string | null) => {
          setSearchQuery(query)
        }}
        darkMode={darkMode}
        serverSideProcessing
        page={currentPage}
        pages={pages}
        setPage={(page: number) => {
          dispatch(setPage({ page }))
        }}
        rowsPerPage={limit}
        setRowsPerPage={(newLimit: number) => {
          dispatch(setLimit({ limit: newLimit }))
        }}
        isPaginated
        isLoading={isLoading}
        showAddNowButton={false}
        totalCountOverride={totalCount}
        defaultOrder='asc'
      />
    </div>
  )
}
