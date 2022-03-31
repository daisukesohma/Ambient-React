import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import get from 'lodash/get'
import find from 'lodash/find'
import map from 'lodash/map'
// src
import { DropdownMenu, Button } from 'ambient_ui'
import { Can } from 'rbac'
import { MixPanelEventEnum } from 'enums'
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import dashboardsDropDownOptions from 'selectors/analytics/dashboardsDropDownOptions'
import {
  setRefreshFrequency,
  selectDashboard,
  setCreateDashboardOpen,
} from 'redux/slices/analytics'
import SimpleLabel from 'components/Label/SimpleLabel'
import CreateDashboardForm from '../CreateDashboardForm'

export default function DashboardToolbar() {
  const dispatch = useDispatch()
  const dashboardOptions = useSelector(dashboardsDropDownOptions)

  const refreshFrequency = useSelector(
    state => state.analytics.refreshFrequency,
  )
  const selectedDashboard = useSelector(
    state => state.analytics.selectedDashboard,
  )

  const createDashboardOpen = useSelector(
    state => state.analytics.createDashboardOpen,
  )

  const baseRefreshOptions = useMemo(
    () => [
      { label: '10s', value: 10 },
      { label: '30s', value: 30 },
      { label: '5m', value: 300 },
      { label: '10m', value: 600 },
      { label: '30m', value: 1800 },
      { label: '60m', value: 3600 },
    ],
    [],
  )

  const refreshEveryOptions = useMemo(
    () =>
      map(baseRefreshOptions, baseRefreshOption => ({
        label: (
          <span>
            <SimpleLabel>Refresh Every</SimpleLabel>
            {baseRefreshOption.label}
          </span>
        ),
        value: baseRefreshOption.value,
      })),
    [baseRefreshOptions],
  )

  useEffect(() => {
    dispatch(
      setRefreshFrequency({ refreshFrequency: baseRefreshOptions[1].value }),
    )
  }, [dispatch, baseRefreshOptions])

  useMixpanel(
    MixPanelEventEnum.ANALYTICS_DASHBOARD_FILTER_UPDATE,
    {
      dashboard: get(selectedDashboard, 'name'),
    },
    [selectedDashboard],
  )

  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
    >
      {dashboardOptions && dashboardOptions.length > 0 && (
        <Box display='flex' flexDirection='row' alignItems='flex-end'>
          <Can I='create' on='Reporting-Analytics'>
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                dispatch(setCreateDashboardOpen({ createDashboardOpen: true }))
              }}
              customStyle={{ marginRight: 8 }}
            >
              Create Dashboard
            </Button>
          </Can>
        </Box>
      )}
      <Box display='flex' flexDirection='row' alignItems='flex-end'>
        <Box>
          <DropdownMenu
            // darkMode={darkMode}
            menuItems={dashboardOptions}
            handleSelection={o => {
              dispatch(selectDashboard({ id: o.value }))
            }}
            selectedItem={find(dashboardOptions, {
              value: get(selectedDashboard, 'id'),
            })}
          />
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
      >
        <Box>
          <DropdownMenu
            // darkMode={darkMode}
            menuItems={refreshEveryOptions}
            selectedItem={find(refreshEveryOptions, {
              value: refreshFrequency,
            })}
            handleSelection={item => {
              dispatch(
                setRefreshFrequency({
                  refreshFrequency: item.value,
                }),
              )
            }}
          />
        </Box>
      </Box>
      <Modal open={createDashboardOpen}>
        <div>
          <CreateDashboardForm />
        </div>
      </Modal>
    </Box>
  )
}
