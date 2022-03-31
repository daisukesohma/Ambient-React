import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'ambient_ui'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { get, map, debounce, toLower } from 'lodash'
import { showModal } from 'redux/slices/modal'
import {
  ActivityTypeEnum,
  ActivityTypeToReadableEnum,
  ModalTypeEnum,
} from 'enums'

import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'
import DataTable from 'components/organisms/DataTable'
import { getActivitySite, getActivityStreamName } from 'utils'
import ActivityDescription from 'components/Activity/ActivityDescription'
import { convertAllUppercaseWordToReadable } from 'pages/ActivityLog/utils'
import { setState } from 'pages/ActivityLog/activityLogSlice'
import { Can } from 'rbac'
import TableCell from 'components/Table/Cell'

import { getActivityName } from './utils'
import useStyles from './styles'
import { AlertLevelLabel } from '../../../ambient_ui'
import { SeverityToReadableTextEnum } from '../../../enums'

ActivityLogTable.propTypes = {
  getActivityLogs: PropTypes.func,
  totalCount: PropTypes.number,
}

ActivityLogTable.defaultProps = {
  getActivityLogs: () => {},
  totalCount: 0,
}

export default function ActivityLogTable({ getActivityLogs, totalCount }) {
  const { palette } = useTheme()
  const history = useHistory()
  const dispatch = useDispatch()
  const { account } = useParams()
  const activityLogs = useSelector(state => state.activityLog.activities)
  const isActivityLogsLoading = useSelector(state => state.activityLog.loading)
  const searchQuery = useSelector(state => state.activityLog.searchQuery)
  const page = useSelector(state => state.activityLog.page)
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const pages = useSelector(state => state.activityLog.pages)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  const setPage = page => dispatch(setState({ page }))

  const handleSearchBarChange = searchQuery => {
    dispatch(setState({ filters: { searchQuery } }))
  }

  useEffect(() => {
    getActivityLogs({ limit: rowsPerPage })
  }, [rowsPerPage])

  const getSeverity = severitySlug =>
    SeverityToReadableTextEnum[toLower(severitySlug)]

  const tableData = map(activityLogs, activity => {
    const site = getActivitySite(activity)
    const severityString = get(activity, 'severity', '')
    return {
      ts: get(activity, 'ts'),
      event: (
        <ActivityDescription
          activity={activity}
          type={get(activity, '__typename')}
          enableOnHover
          darkMode={darkMode}
        />
      ),
      site: get(site, 'name'),
      severity: getSeverity(severityString),
      timezone: get(site, 'timezone'),
      stream: getActivityStreamName(activity),
      type:
        get(activity, '__typename') &&
        ActivityTypeToReadableEnum[activity.__typename],
      eventName: getActivityName(activity, get(activity, '__typename')),
      accessAlarmTypeCast: activity.accessAlarmTypeCast,
      accessAlarmType: activity.accessAlarmType,
    }
  })

  const viewModal = useCallback(
    activity => {
      let data
      if (activity.__typename === ActivityTypeEnum.AlertEventType) {
        data = {
          content: {
            alertEvent: activity,
          },
          type: ModalTypeEnum.ALERT,
        }
      } else {
        data = {
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
        }
      }
      dispatch(showModal(data))
    },
    [dispatch],
  )

  const handleEdit = accessAlarmTypeCast => () => {
    history.push(
      `/accounts/${account}/history/activities/regex-map/${
        accessAlarmTypeCast ? accessAlarmTypeCast.id : 'other'
      }`,
    )
  }

  const renderDate = rowData => {
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
        <span className={`am-subtitle1 ${classes.date}`}>
          {formatUnixTimeWithTZ(
            rowData.ts,
            'yyy-MM-dd HH:mm:ss zzz',
            rowData.timezone,
          )}
        </span>
      </div>
    )
  }

  const renderType = rowData => {
    const isAccessAlarm =
      rowData.type === ActivityTypeToReadableEnum.AccessAlarmType
    const accessAlarmType = convertAllUppercaseWordToReadable(
      rowData.accessAlarmType || 'Other',
    )

    return (
      <Grid container direction='row' alignItems='center'>
        <Box display='flex' flexDirection='column'>
          {isAccessAlarm && (
            <Box mb={0.25}>
              <span style={{ color: palette.primary.main, fontSize: 14 }}>
                {accessAlarmType}
              </span>
            </Box>
          )}
          <Box className={classes.text}>{rowData.type}</Box>
        </Box>
        {isAccessAlarm && (
          <Can I='update' on='AccessAlarm'>
            <div
              className={classes.editBtn}
              onClick={handleEdit(rowData.accessAlarmTypeCast)}
            >
              Edit
            </div>
          </Can>
        )}
        {rowData.severity && (
          <AlertLevelLabel level={rowData.severity} label={rowData.severity} />
        )}
      </Grid>
    )
  }

  const tableColumns = [
    {
      title: 'Date',
      field: 'ts',
      props: { style: { fontWeight: 'bold', color: palette.common.black } },
      render: renderDate,
      sorting: false,
    },
    {
      title: 'Type',
      field: 'type',
      render: renderType,
      sorting: false,
    },
    {
      title: 'Site',
      field: 'site',
      render: row => <TableCell>{row.site}</TableCell>,
      sorting: false,
    },
    {
      title: 'Stream',
      field: 'stream',
      render: row => <TableCell>{row.stream}</TableCell>,
      sorting: false,
    },
    {
      title: 'Event',
      field: 'event',
      sorting: false,
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
        onClick: (e, row) => viewModal(row.event.props.activity),
      },
    ]
  }, [viewModal])

  return (
    <div className={classes.root}>
      <DataTable
        serverSideProcessing
        isLoading={isActivityLogsLoading}
        data={tableData || null}
        defaultRowsPerPage={rowsPerPage}
        columns={tableColumns}
        isSearchable
        onSearch={debounce(handleSearchBarChange, 500)}
        darkMode={darkMode}
        emptyComment={
          isActivityLogsLoading
            ? 'Loading data...'
            : `No activities found based on selection.`
        }
        defaultSearchValue={searchQuery}
        actions={dataTableActions}
        showAddNowButton={false}
        totalCountOverride={totalCount}
        page={page} // TODO: FIX DataTable pagination
        pages={pages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  )
}
