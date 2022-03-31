import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { useParams } from 'react-router-dom'
// src
import { Button } from 'ambient_ui'
import {
  dashboardsFetchRequested,
  metricTypesFetchRequested,
  conditionTypesFetchRequested,
  threatSignaturesFetchRequested,
  zonesFetchRequested,
  sitesFetchRequested,
  selectDashboard,
} from 'redux/slices/analytics'
import PageTitle from 'components/Page/Title'
import Modal from 'components/Modal'
import { Can } from 'rbac'
import { MixPanelEventEnum } from 'enums'
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import DashboardToolbar from './components/DashboardToolbar'
import DashboardContainer from './components/DashboardContainer'
import CreateMetricForm from './components/CreateMetricForm'
import makeStyles from './styles'
import analyticsLoading from '../../../selectors/analytics/analyticsLoading'
import LoadingScreen from '../../LoadingScreen'

export default function AnalyticsReport() {
  const { account } = useParams()
  const dispatch = useDispatch()

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const dashboards = useSelector(state => state.analytics.dashboards)
  const loading = useSelector(analyticsLoading)
  const classes = makeStyles({ darkMode: false })

  useEffect(() => {
    batch(() => {
      dispatch(dashboardsFetchRequested({ accountSlug: account }))
      dispatch(metricTypesFetchRequested())
      dispatch(threatSignaturesFetchRequested({ allowAnalytics: true }))
      dispatch(zonesFetchRequested())
      dispatch(sitesFetchRequested({ accountSlug: account }))
      dispatch(conditionTypesFetchRequested())
    })
  }, [dispatch, account])

  useMixpanel(MixPanelEventEnum.ANALYTICS_ENTER)

  // Auto-select first one
  useEffect(() => {
    if (dashboards && dashboards.length > 0) {
      dispatch(
        selectDashboard({
          id: dashboards[0].id,
        }),
      )
    }
  }, [dispatch, dashboards])

  if (loading) return <LoadingScreen />

  return (
    <Grid container>
      <div className={classes.stickyHeader}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <PageTitle title='Analytics' />

            <Box
              mt={2}
              mb={2}
              display='flex'
              flexDirection='row'
              alignItems='center'
            >
              <DashboardToolbar />
              <Can I='create' on='Reporting-Analytics'>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => setIsCreateOpen(true)}
                  customStyle={{ marginLeft: 8 }}
                >
                  Create Metric
                </Button>
              </Can>
            </Box>
          </Box>
          <Divider
            variant='fullWidth'
            light={false}
            classes={{ root: classes.dividerColor }}
          />
        </Grid>
      </div>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box mt={1} ml={-1}>
          <DashboardContainer />
        </Box>
      </Grid>
      <Modal
        isChildOpen={isCreateOpen}
        handleChildClose={() => setIsCreateOpen(false)}
        showCloseIcon={false}
        customStyle={{
          padding: 0,
          maxWidth: 675,
          border: 'none',
          overflowY: 'visible',
        }}
      >
        <CreateMetricForm onCancel={() => setIsCreateOpen(false)} />
      </Modal>
    </Grid>
  )
}
