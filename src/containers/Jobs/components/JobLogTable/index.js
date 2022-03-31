import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import { useTheme } from '@material-ui/core/styles'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'ambient_ui'
import clsx from 'clsx'

import DataTable from 'components/organisms/DataTable'
import { DateField } from 'components/atoms/fields'

import { jobLogsFetchRequested } from 'redux/slices/jobLog'
import { clearStreamDiscoveryState } from 'redux/streamDiscovery/actions'
import sortedByTime from 'selectors/jobLogs/sortedByTime'
import {
  NodeRequestTypeEnum,
  NodeRequestStatusEnum,
  NodeRequestTypeToReadableEnum,
  NodeRequestStatusToReadableEnum,
} from 'enums'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'
import { AddButton, RefreshTableData } from './tools'
import { DescriptionField, NodeField, StatusField, JobField } from './fields'

function JobLogContainer() {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const flexClasses = useFlexStyles()
  const classes = useStyles()
  const dispatch = useDispatch()
  const { account } = useParams()
  const history = useHistory()
  const nodeIdentifiers = null // must be null or an array. Cannot be undefined, and not empty array
  const jobLogs = useSelector(sortedByTime)
  const isLoading = useSelector(state => state.jobLog.loading)
  const [page, setPage] = useState(0)
  const pages = useSelector(state => state.jobLog.pages)
  const [limit, setLimit] = useState(25)
  const totalCount = useSelector(state => state.jobLog.totalCount)

  const fetchJobs = useCallback(() => {
    dispatch(
      jobLogsFetchRequested({
        accountSlug: account,
        nodeIdentifiers,
        page: page + 1, // API request page number should start from 1
        limit,
      }),
    )
  }, [account, dispatch, page, limit])

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(() => {
      fetchJobs()
    }, 5 * 60000)
    return () => {
      clearInterval(interval)
    }
  }, [account, fetchJobs])

  useEffect(() => {
    dispatch(clearStreamDiscoveryState())
  }, [dispatch])

  const [tableData, setTableData] = useState([]) // eslint-disable-line  no-unused-vars
  const [filteredTableData, setFilteredTableData] = useState([])
  const emptyComment = 'No Jobs'
  const loadingComment = (
    <span className={clsx('am-subtitle', classes.loadingText)}>
      Loading jobs on {account}
      ...
    </span>
  )

  const getDescription = log => {
    return `${NodeRequestTypeToReadableEnum[log.requestType]} on ${
      log.node.name
    }`
  }

  useEffect(() => {
    if (jobLogs && jobLogs.length > 0) {
      const data = jobLogs.map(log => {
        const {
          createdTs,
          updatedTs,
          requestType,
          status,
          summary,
          request,
        } = log
        return {
          id: log.id,
          createdTs,
          updatedTs,
          requestType,
          status,
          nodeName: log.node.name,
          descriptionText: getDescription(log),
          statusText: NodeRequestStatusToReadableEnum[status],
          summary,
          request,
        }
      })
      setTableData(data)
      setFilteredTableData(data)
    }
  }, [jobLogs])

  const actions = [
    {
      icon: row => {
        if (
          row.requestType === NodeRequestTypeEnum.DISCOVERY &&
          row.status === NodeRequestStatusEnum.COMPLETED
        ) {
          return (
            <Icon
              icon='eye'
              color={darkMode ? palette.primary[300] : palette.primary.main}
            />
          )
        }
        return null
      },
      tooltip: 'View',
      onClick: (e, row) => {
        history.push(
          `/accounts/${account}/infrastructure/jobs/${row.id}/stream-discovery`,
        )
      },
    },
  ]

  // field is necessary to filter on column headers
  const tableColumns = [
    {
      title: 'Date',
      render: ({ createdTs }) => (
        <DateField timestamp={moment(createdTs).unix()} />
      ),
      field: 'createdTs',
    },
    { title: 'Job', render: JobField, field: 'requestType' },
    { title: 'Node', render: NodeField, field: 'nodeName' },
    { title: 'Details', render: DescriptionField, field: 'descriptionText' },
    {
      title: 'Status',
      render: StatusField,
      field: 'statusText',
      minWidth: 120,
    }, // used for table cell min width setting
  ]

  const additionalTools = (
    <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
      <span style={{ marginRight: 32 }}>
        <RefreshTableData handleFetch={fetchJobs} />
      </span>
      <AddButton />
    </div>
  )

  return (
    <DataTable
      darkMode={darkMode}
      serverSideProcessing
      {...{
        page,
        pages,
        setPage,
        rowsPerPage: limit,
        setRowsPerPage: setLimit,
      }}
      actions={actions}
      additionalTools={additionalTools}
      columns={tableColumns}
      data={filteredTableData}
      defaultRowsPerPage={25}
      emptyComment={isLoading ? loadingComment : emptyComment}
      isLoading={isLoading}
      isSearchable={false}
      showAddNowButton={false}
      totalCountOverride={totalCount}
    />
  )
}

export default JobLogContainer

// FUTURE @ERIC Jira ticket for adding syncing
// <div style={{display: 'flex'}}>
//   <Tools
//     identitySourcesMetaInfo={identitySourcesMetaInfo}
//     onSync={onSync}
//     syncing={syncing}
//   />
//   <div style={{ marginRight: 8 }}>
//     <SearchableSelectDropdown
//       options={sitesOptions}
//       styles={selectStyles}
//       isSearchable={false}
//       onChange={handleSiteSelection}
//       placeholder={'Filter sites'}
//     />
//   </div>
// </div>
