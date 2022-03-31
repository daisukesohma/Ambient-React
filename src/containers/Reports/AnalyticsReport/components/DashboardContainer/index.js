import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import findIndex from 'lodash/findIndex'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import { DragDropContext } from 'react-beautiful-dnd'
import { Alert, AlertTitle } from '@material-ui/lab'
import get from 'lodash/get'
import map from 'lodash/map'
import parseInt from 'lodash/parseInt'
// src
import { Button, MoreOptionMenu } from 'ambient_ui'
import config from 'config'
import ConfirmDialog from 'components/ConfirmDialog'
import MetricContainer from '../MetricContainer'
import MetricVisualization from 'components/organisms/MetricVisualization'
import CreateDashboardForm from '../CreateDashboardForm'
import DashboardConcept from '../DashboardConcept' // Concept dashboard for demo purposes
import {
  deleteAnalyticsDashboardRequested,
  arrangeAnalyticsDashboardRequested,
  setCreateDashboardOpen,
} from 'redux/slices/analytics'
import useStyles from './styles'

// NB: Using a fix grid size of 6 for charts right now.
const DashboardContainer = () => {
  const dispatch = useDispatch()
  const selectedDashboard = useSelector(
    state => state.analytics.selectedDashboard,
  )
  const dashboards = useSelector(state => state.analytics.dashboards)
  const isDemo = config.settings.demo
  const createDashboardOpen = useSelector(
    state => state.analytics.createDashboardOpen,
  )
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const classes = useStyles({ darkMode: false })

  const emptyDashboards = useMemo(
    () => (
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        height={1}
        mt={16}
      >
        <Box className={classes.textColor}>
          You have not created any dashboards yet.
        </Box>
        <Box mt={2.0}>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              dispatch(setCreateDashboardOpen({ createDashboardOpen: true }))
            }}
          >
            Create your first dashboard
          </Button>
        </Box>
        <Modal open={createDashboardOpen}>
          <div>
            <CreateDashboardForm />
          </div>
        </Modal>
      </Box>
    ),
    [classes.textColor, dispatch, createDashboardOpen],
  )

  const getMoreMenuItems = useMemo(() => {
    // I={'delete'} on={'Reporting-Analytics'}
    return [
      {
        label: 'Edit',
        onClick: () => {},
      },
      {
        label: 'Delete',
        onClick: () => setDeleteConfirmOpen(true),
      },
    ]
  }, [setDeleteConfirmOpen])

  if (!dashboards.length) return emptyDashboards
  if (!selectedDashboard) return <LinearProgress />

  return (
    <Box p={2}>
      <Grid container>
        <Grid item lg={12} md={12} xs={12} sm={12}>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <Typography variant='h4' className={classes.textColor}>
                {selectedDashboard.name}
              </Typography>
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <MoreOptionMenu
                noBackground
                darkMode={false}
                menuItems={getMoreMenuItems}
              />
              <ConfirmDialog
                open={deleteConfirmOpen}
                onClose={() => {
                  setDeleteConfirmOpen(false)
                }}
                onConfirm={() => {
                  dispatch(
                    deleteAnalyticsDashboardRequested({
                      id: selectedDashboard.id,
                    }),
                  )
                  setDeleteConfirmOpen(false)
                }}
                content='Are you sure you want to delete this dashboard?'
              />
            </Box>
          </Box>
        </Grid>
        <Grid item lg={12} md={12} xs={12} sm={12}>
          <Box mt={1} mb={1}>
            <Typography variant='caption' className={classes.textColor}>
              {selectedDashboard.description}

              <Alert severity='warning' className={classes.alertPanel}>
                <AlertTitle>
                  The timestamp will be based on the site timezone of the metric
                </AlertTitle>
              </Alert>
            </Typography>
          </Box>
        </Grid>
        <DragDropContext
          onDragEnd={({ source, destination }) => {
            const sourceId = parseInt(source.droppableId, 10)
            const destinationId = parseInt(destination.droppableId, 10)

            if (sourceId !== destinationId) {
              const swap1 = findIndex(selectedDashboard.metrics, {
                id: sourceId,
              })
              const swap2 = findIndex(selectedDashboard.metrics, {
                id: destinationId,
              })
              dispatch(
                arrangeAnalyticsDashboardRequested({
                  id: selectedDashboard.id,
                  order: map(
                    get(selectedDashboard, 'metrics'),
                    (metric, index) => {
                      if (index === swap1) return destinationId
                      if (index === swap2) return sourceId
                      return metric.id
                    },
                  ),
                }),
              )
            }
          }}
        >
          {selectedDashboard.concept && (
            <DashboardConcept metrics={selectedDashboard.metrics} />
          )}
          <MetricVisualization header='Total Alerts by Site' />
          {!selectedDashboard.concept &&
            map(get(selectedDashboard, 'metrics'), metric => (
              <Grid
                item
                lg={
                  metric.size ||
                  (metric.chartType === 'stream_breakdown' ? 12 : 6)
                }
                md={12}
                sm={12}
                xs={12}
                key={metric.id}
              >
                <Paper elevation={1} className={classes.cell}>
                  {/* <MetricContainer
                    metric={metric}
                    dashboardId={selectedDashboard.id}
                  /> */}
                </Paper>
              </Grid>
            ))}
        </DragDropContext>
        {isDemo && (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Paper elevation={1}>
              <Box mt={2} p={2}>
                <Box>
                  <Typography variant='h6'>
                    <b>Social Distancing</b>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='caption'>
                    Live social distancing compliance view
                  </Typography>
                </Box>
                <Box mt={2}>
                  <video
                    autoPlay
                    controls
                    muted
                    playsInline
                    style={{ width: '100%' }}
                  >
                    <source
                      type='video/mp4'
                      src='https://dev.ambient.ai/static/public/social_distance_full.mp4'
                    />
                  </video>
                </Box>
                <Box mt={1}>
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={() => {
                      window.location.href =
                        'https://dev.ambient.ai/static/public/social_distance_1.mp4'
                    }}
                  >
                    Download Export
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default DashboardContainer
