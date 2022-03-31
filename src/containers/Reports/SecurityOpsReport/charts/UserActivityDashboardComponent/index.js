/*
 * author: rodaan@ambient.ai
 * Note: Might make sense to abstract this away
 * kept this together because I wanted each component to be self contained
 */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { DataTable } from 'ambient_ui'
import Tooltip from '@material-ui/core/Tooltip'
import get from 'lodash/get'
import map from 'lodash/map'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import config from 'config'
import mockData from '../../mockData'
import LoadingContainer from '../../common/LoadingContainer'
import ErrorPanel from '../../common/ErrorPanel'

import { GET_USER_ACTIVITY } from './gql'

const UserActivityDashboardComponent = ({
  pollInterval,
  isTest,
  severities,
}) => {
  const { palette } = useTheme()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state => get(state, 'reports.startTs', null))
  const darkMode = useSelector(state => state.settings.darkMode)
  const endTs = useSelector(state => get(state, 'reports.endTs', null))
  const isDemo = config.settings.demo

  const tableHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }

  // const tooltipStyle = {
  //   border: 'none',
  //   // color: palette.common.white,
  //   // backgroundColor: palette.grey[700],
  // }

  const createHeaderWithTooltip = (title, tooltip) => {
    return (
      <Tooltip placement='top' title={tooltip}>
        <div style={tableHeaderStyle}>{title}</div>
      </Tooltip>
      // <Tooltip title={tooltip} placement='top' customStyle={tooltipStyle}>
      //   <div style={tableHeaderStyle}>{title}</div>
      // </Tooltip>
    )
  }

  const menuItems = [
    {
      label: 'Operators',
      value: 'Administrator',
    },
    {
      label: 'Responders',
      value: 'Responder',
    },
  ]

  const columns = [
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: createHeaderWithTooltip(
        'Resolved Alerts',
        'Number of alerts user resolved at the time of the resolve action in the filtered date range',
      ),
      field: 'ackedAlerts',
      defaultSort: 'desc',
      sorting: true,
    },
    {
      title: createHeaderWithTooltip(
        'Dispatches Received',
        'Number of dispatch requests made to the user in the filtered date range',
      ),
      field: 'dispatchesReceived',
    },
    {
      title: createHeaderWithTooltip(
        'Dispatches Seen',
        'Number of dispatch requests user opened in the filtered date range',
      ),
      field: 'dispatchesSeen',
    },
    {
      title: createHeaderWithTooltip(
        'Dispatches Resolved',
        'Number of dispatch requests user resolved in the filtered date range',
      ),
      field: 'dispatchesResolved',
    },
    {
      title: createHeaderWithTooltip(
        'Dispatches Declined',
        'Number of dispatch requests user declined in the filtered date range',
      ),
      field: 'dispatchesDenied',
    },
    // TODO (varun): Include this metric in a separate chart. Need to sync
    // with Andy and Kelly
    // {
    //   title: createHeaderWithTooltip(
    //     'Time To Action (sec)',
    //     'Average time it takes for the first action on an alert (comment/dispatch/resolve)',
    //   ),
    //   field: 'ttaAlerts',
    //   defaultSort: 'desc',
    //   sorting: true,
    // },
  ]

  const queryOptions = {
    variables: {
      accountSlug: account,
      siteSlug: globalSelectedSite,
      startTs,
      endTs,
      isTest,
      severities,
    },
    skip: isDemo,
  }

  if (pollInterval) {
    queryOptions.pollInterval = pollInterval
  }

  const { loading, error, data } = useQuery(GET_USER_ACTIVITY, queryOptions)

  const source = isDemo ? mockData : data
  const title = 'User Activity Dashboard'

  if (loading) {
    return <LoadingContainer title={title} darkMode={darkMode} />
  }

  if (error) {
    return <ErrorPanel title={title} />
  }

  const dataArr = map(
    get(source, 'userActivityReports', []),
    userActivityReport => ({
      name: userActivityReport.name,
      dispatchesSeen: userActivityReport.dispatchesSeen,
      dispatchesReceived: userActivityReport.dispatchesReceived,
      dispatchesResolved: userActivityReport.dispatchesResolved,
      dispatchesDenied: userActivityReport.dispatchesDenied,
      ackedAlerts: userActivityReport.ackedAlertEvents,
      // ttaAlerts: userActivityReport.ttaAlertEvents,
    }),
  )

  return (
    <DataTable
      title={title}
      showMenu={false}
      menuItems={menuItems}
      data={dataArr}
      columns={columns}
      options={{
        search: true,
        sorting: true,
      }}
    />
  )
}

UserActivityDashboardComponent.defaultProps = {
  pollInterval: null,
  isTest: false,
  severities: [],
}

UserActivityDashboardComponent.propTypes = {
  pollInterval: PropTypes.number,
  isTest: PropTypes.bool,
  severities: PropTypes.array,
}

export default UserActivityDashboardComponent
