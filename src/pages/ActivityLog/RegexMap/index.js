import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Box } from '@material-ui/core'
import { isMobile, isBrowser } from 'react-device-detect'
import { Button, SearchBar, Icon, DropdownMenu } from 'ambient_ui'
import get from 'lodash/get'
import moment from 'moment'
import debounce from 'lodash/debounce'
import { getActivitySite } from 'utils'
import { showModal } from 'redux/slices/modal'
import PageTitle from 'components/Page/Title'
import {
  accessAlarmsRegexFetchRequested,
  createAccessAlarmTypeCastRequested,
  updateAccessAlarmTypeCastRequested,
  getAccessAlarmTypeCastByIdRequested,
  clearUpdateRes,
  fetchAccessAlarmTypesRequested,
} from 'pages/ActivityLog/activityLogSlice'
import DataTable from 'components/organisms/DataTable'
import { ModalTypeEnum } from 'enums'
import ActivityDescription from 'components/Activity/ActivityDescription'

import { convertAllUppercaseWordToReadable } from '../utils'

import useStyles from './styles'

const DEFAULT_PAGE_LIMIT = 25

export default function RegexMap() {
  const { palette } = useTheme()
  const classes = useStyles()
  const history = useHistory()

  const dispatch = useDispatch()
  const { account, accessAlarmTypeCastId } = useParams()

  const accessAlarmTypeCast = useSelector(
    state => state.activityLog.accessAlarmTypeCast,
  )
  const regexAccessAlarms = useSelector(
    state => state.activityLog.regexAccessAlarms,
  )
  const pages = useSelector(state => state.activityLog.regexAccessAlarmsPages)
  const isLoading = useSelector(state => state.activityLog.regexLoading)
  const accessAlarmTypes = useSelector(
    state => state.activityLog.accessAlarmTypes,
  )
  const updateRes = useSelector(state => state.activityLog.updateRes)

  const [tableData, setTableData] = useState([])
  const [shouldWriteTableData, setShouldWriteTableData] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMIT)
  const [page, setPage] = useState(0)
  const [regexInput, setRegexInput] = useState(
    accessAlarmTypeCast ? accessAlarmTypeCast.regex : '',
  )

  const [
    selectedAccessAlarmTypeOption,
    setSelectedAccessAlarmTypeOption,
  ] = useState(
    // eslint-disable-next-line no-nested-ternary
    accessAlarmTypes && accessAlarmTypes.length
      ? accessAlarmTypeCast
        ? {
            value: accessAlarmTypeCast.accessAlarmType,
            label: convertAllUppercaseWordToReadable(
              accessAlarmTypeCast.accessAlarmType,
            ),
          }
        : {
            value: accessAlarmTypes[0],
            label: convertAllUppercaseWordToReadable(accessAlarmTypes[0]),
          }
      : null,
  )

  const viewModal = activity => () => {
    dispatch(
      showModal({
        content: {
          streamName: get(activity, 'reader.stream.name'),
          streamId: get(activity, 'reader.stream.id'),
          nodeId: get(activity, 'reader.stream.node.identifier'),
          siteName: get(activity, 'reader.site.name'),
          siteSlug: get(activity, 'reader.site.slug'),
          timezone: get(getActivitySite(activity), 'timezone'),
          initTs: get(activity, 'ts'),
        },
        type: ModalTypeEnum.VIDEO,
      }),
    )
  }

  const handleRegexInput = debounce(val => {
    setRegexInput(val)
    setPage(0)
    dispatch(
      accessAlarmsRegexFetchRequested({
        accountSlug: account,
        regex: val,
        page: 1,
        limit: rowsPerPage,
      }),
    )
  }, 500)

  const handleTypeSelection = option => {
    setSelectedAccessAlarmTypeOption(option)
  }

  const saveRegex = () => {
    if (accessAlarmTypeCast) {
      dispatch(
        updateAccessAlarmTypeCastRequested({
          accountSlug: account,
          regex: regexInput,
          accessAlarmType: selectedAccessAlarmTypeOption.value,
          accessAlarmTypeCastId: accessAlarmTypeCast.id,
        }),
      )
    } else {
      dispatch(
        createAccessAlarmTypeCastRequested({
          accountSlug: account,
          regex: regexInput,
          accessAlarmType: selectedAccessAlarmTypeOption.value,
        }),
      )
    }
  }

  useEffect(() => {
    if (!isLoading) {
      setShouldWriteTableData(true)
    }
  }, [isLoading])

  useEffect(() => {
    dispatch(fetchAccessAlarmTypesRequested())
  }, [dispatch])

  useEffect(() => {
    if (updateRes && updateRes.ok) {
      dispatch(clearUpdateRes())
      history.push(`/accounts/${account}/history/activities/`)
    }
  }, [updateRes, account, dispatch, history])

  useEffect(() => {
    dispatch(
      accessAlarmsRegexFetchRequested({
        accountSlug: account,
        regex: accessAlarmTypeCast ? accessAlarmTypeCast.regex : regexInput,
        page: page + 1,
        limit: rowsPerPage,
      }),
    )
    // eslint-disable-next-line
  }, [dispatch, account, accessAlarmTypeCast, page, rowsPerPage])

  useEffect(() => {
    if (accessAlarmTypeCastId !== 'other') {
      dispatch(getAccessAlarmTypeCastByIdRequested({ accessAlarmTypeCastId }))
    }
  }, [dispatch, accessAlarmTypeCastId])

  useEffect(() => {
    if (regexAccessAlarms && shouldWriteTableData) {
      const data = regexAccessAlarms.map(accessAlarm => {
        if (accessAlarm) {
          return {
            date: get(accessAlarm, 'ts'),
            event: (
              <ActivityDescription
                activity={accessAlarm}
                type={get(accessAlarm, '__typename')}
                darkMode={false}
                enableOnHover
              />
            ),
          }
        }

        return {}
      })
      setTableData(data)
      setShouldWriteTableData(false)
    }
  }, [regexAccessAlarms, tableData, shouldWriteTableData])

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
      title: 'Event',
      field: 'event',
    },
  ]

  const accessAlarmTypesOptions = accessAlarmTypes
    ? accessAlarmTypes.map(type => {
        return {
          value: type,
          label: convertAllUppercaseWordToReadable(type),
        }
      })
    : []

  return (
    <div>
      <PageTitle title='Regex Map for Access Alarms' />
      <Box
        display='flex'
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems='center'
        flexWrap='wrap'
        className={classes.filterRoot}
      >
        <Box pr={1} style={{ flex: 1 }}>
          <SearchBar
            InputProps={{
              placeholder: 'Enter Regex',
            }}
            onChange={handleRegexInput}
            defaultValue={accessAlarmTypeCast ? accessAlarmTypeCast.regex : ''}
          />
        </Box>
        <Box pr={1} style={{ flex: 1 }}>
          <DropdownMenu
            menuItems={accessAlarmTypesOptions}
            selectedItem={selectedAccessAlarmTypeOption}
            handleSelection={handleTypeSelection}
          />
        </Box>
        <Box width={1} maxWidth={isBrowser ? 130 : 'unset'} pl={1} pr={1}>
          <Button className={classes.saveBtn} onClick={saveRegex}>
            Save
          </Button>
        </Box>
      </Box>
      <DataTable
        serverSideProcessing
        columns={tableColumns}
        data={tableData || []}
        defaultRowsPerPage={rowsPerPage}
        isLoading={isLoading}
        isSearchable={false}
        emptyComment={
          isLoading
            ? 'Loading data...'
            : `You have no Access Alarms matching regex`
        }
        actions={[
          {
            icon: row => {
              return <Icon icon='eye' size={24} color={palette.primary.main} />
            },
            tooltip: 'View',
            onClick: (e, row) => viewModal(row.event.props.activity)(),
          },
        ]}
        showAddNowButton={false}
        {...{ page, pages, setPage, rowsPerPage, setRowsPerPage }}
      />
    </div>
  )
}
