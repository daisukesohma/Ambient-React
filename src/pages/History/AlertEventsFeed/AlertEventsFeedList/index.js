import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { Icon } from 'ambient_ui'
import get from 'lodash/get'
// src
import { showModal } from 'redux/slices/modal'
import { activityLogsFetchRequested } from 'pages/ActivityLog/activityLogSlice'
import {
  ActivityTypeEnum,
  ActivityTypeToReadableEnum,
  ModalTypeEnum,
} from 'enums'
import sortedByTime from 'selectors/activityLogs/sortedByTime'
import DataTable from 'components/organisms/DataTable'
import { getActivitySiteName, getActivitySite } from 'utils'
import ActivityDescription from 'components/Activity/ActivityDescription'

import { getActivityDescriptionDownloadable, getActivityName } from './utils'
import useStyles from './styles'

const DEFAULT_PAGE_LIMIT = 25

AlertEventsFeedList.propTypes = {
  endTs: PropTypes.number,
  startTs: PropTypes.number,
}

AlertEventsFeedList.defaultProps = {
  endTs: null,
  startTs: null,
}

export default function AlertEventsFeedList({ endTs, startTs }) {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles()
  const dispatch = useDispatch()
  const { account } = useParams()
  const [tableData, setTableData] = useState([])
  const [downloadableTableData, setDownloadableTableData] = useState(undefined)
  const [shouldWriteTableData, setShouldWriteTableData] = useState(false)
  const activityLogs = useSelector(sortedByTime)
  const isActivityLogsLoading = useSelector(state => state.activityLog.loading)

  const pages = useSelector(state => state.activityLog.pages)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT)

  useEffect(() => {
    if (!isActivityLogsLoading) {
      setShouldWriteTableData(true)
    }
  }, [isActivityLogsLoading])

  useEffect(() => {
    dispatch(
      activityLogsFetchRequested({
        accountSlug: account,
        endTs,
        startTs,
        page: page + 1,
        limit: rowsPerPage,
      }),
    )
  }, [dispatch, account, rowsPerPage, page, startTs, endTs])

  // format table data
  useEffect(() => {
    if (activityLogs && shouldWriteTableData) {
      const data = activityLogs.map(activity => {
        if (activity) {
          return {
            date: get(activity, 'ts'),
            event: (
              <ActivityDescription
                activity={activity}
                type={get(activity, '__typename')}
                darkMode={false}
                enableOnHover
              />
            ),
            site: getActivitySiteName(activity),
            type:
              get(activity, '__typename') &&
              ActivityTypeToReadableEnum[activity.__typename],
            eventName: getActivityName(activity, get(activity, '__typename')),
          }
        }

        return {}
      })
      setTableData(data)
      setShouldWriteTableData(false)
    }
  }, [activityLogs, tableData, shouldWriteTableData])

  // format downloadable data
  useEffect(() => {
    if (activityLogs && activityLogs.length > 0) {
      const data = activityLogs.map(activity => {
        if (activity) {
          return {
            date:
              get(activity, 'ts') &&
              `${moment.unix(activity.ts).format('l')} ${moment
                .unix(activity.ts)
                .format('HH:mm:ss A')}`,
            event: getActivityDescriptionDownloadable(
              activity,
              get(activity, '__typename'),
            ),
            site: getActivitySiteName(activity),
            type:
              get(activity, '__typename') &&
              ActivityTypeToReadableEnum[activity.__typename],
          }
        }

        return {}
      })

      setDownloadableTableData(data)
    }
  }, [activityLogs, tableData])

  const viewModal = useCallback(
    activity => () => {
      if (activity.__typename === ActivityTypeEnum.AlertEventType) {
        dispatch(
          showModal({
            content: {
              alertEvent: activity,
            },
            type: ModalTypeEnum.ALERT,
          }),
        )
      } else {
        dispatch(
          showModal({
            content: {
              streamName: get(activity, 'reader.stream.name'),
              streamId: get(activity, 'reader.stream.id'),
              nodeId: get(activity, 'reader.stream.node.identifier'),
              siteName: get(activity, 'reader.site.name'),
              siteSlug: get(activity, 'reader.site.slug'),
              initTs: get(activity, 'ts'),
              timezone: get(getActivitySite(activity), 'timezone'),
            },
            type: ModalTypeEnum.VIDEO,
          }),
        )
      }
    },
    [dispatch],
  )

  const renderDate = rowData => {
    const unixTs = moment.unix(rowData.date)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 'fit-content',
          alignItems: 'center',
        }}
      >
        <span
          className='am-subtitle1'
          style={{ color: palette.common.black, marginRight: 8 }}
        >
          {unixTs.format('l')}
        </span>
        <span className='am-subtitle2' style={{ color: palette.grey[700] }}>
          {unixTs.format('HH:mm:ss')}
        </span>
      </div>
    )
  }

  const tableColumns = [
    {
      title: 'Date',
      field: 'date',
      props: { style: { fontWeight: 'bold', color: palette.common.black } },
      render: renderDate,
    },
    {
      title: 'Type',
      field: 'type',
    },
    {
      title: 'Site',
      field: 'site',
    },
    {
      title: 'Event',
      field: 'event',
    },
  ]

  const dataTableActions = useMemo(() => {
    return [
      {
        icon: row => {
          // eslint-disable-line react/display-name
          if (
            get(row, 'event.props.activity.__typename') ===
              ActivityTypeEnum.AlertEventType ||
            (get(row, 'event.props.activity.__typename') ===
              ActivityTypeEnum.AccessAlarmType &&
              get(row, 'event.props.activity.evidenceAvailable'))
          ) {
            return <Icon icon='eye' size={24} color={palette.primary.main} />
          }
          return null
        },
        tooltip: 'View',
        onClick: (e, row) => viewModal(row.event.props.activity)(),
      },
    ]
  }, [viewModal])

  return (
    <div className={classes.root}>
      <DataTable
        darkMode={darkMode}
        serverSideProcessing
        isDownloadable
        downloadableFileName='history-data.csv'
        isLoading={isActivityLogsLoading}
        downloadableData={downloadableTableData}
        data={tableData || null}
        defaultRowsPerPage={rowsPerPage}
        columns={tableColumns}
        isSearchable={false}
        emptyComment={
          isActivityLogsLoading
            ? 'Loading data...'
            : `You have no Alerts between ${moment.unix(startTs).format('l')}
            and ${moment.unix(endTs).format('l')}`
        }
        filterOptions={[
          {
            position: 0,
            type: 'CheckboxList',
            field: 'type',
            placeholder: 'Filter by Type',
          },
          {
            position: 1,
            type: 'CheckboxList',
            field: 'eventName',
            placeholder: 'Filter by Event',
          },
        ]}
        actions={dataTableActions}
        showAddNowButton={false}
        {...{ page, pages, setPage, rowsPerPage, setRowsPerPage }}
      />
    </div>
  )
}
