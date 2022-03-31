import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { isMobileOnly } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress'
import isNumber from 'lodash/isNumber'
import find from 'lodash/find'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import SecurityPosturePanel from 'features/SecurityPosturePanel'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

import {
  // ALERTS
  alertsFetchRequested,
  alertsFetchSucceeded,
  defaultAlertsFetchRequested,

  // SITES
  fetchSitesRequested,

  // STREAMS
  streamsBySiteFetchRequested,

  // REGIONS
  regionsFetchRequested,

  // SP
  securityProfilesFetchRequested,
  defaultSecurityProfilesFetchRequested,
} from '../../redux/contextGraph/actions'
import graphRelations from '../../selectors/contextGraph/graphRelations'
import contextGraphLoading from '../../selectors/contextGraph/loading'

import GraphV2 from './components/GraphV2'
import ContextGraphToolbar from './components/ContextGraphToolbar'
import ContextGraphProfileSelector from './components/ContextGraphProfileSelector'
import ContextGraphAuditViewPanel from './components/ContextGraphAuditViewPanel'
import useStyles from './styles'
import { Can } from 'rbac'

const ContextGraph = () => {
  const { account } = useParams()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const isDeployOpen = useSelector(state => state.contextGraph.createAlertOpen)
  const loading = useSelector(contextGraphLoading)
  const sites = useSelector(state => state.contextGraph.sites)
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()
  const regions = useSelector(state => state.contextGraph.regions)
  const activeProfile = useSelector(state => state.contextGraph.activeProfile)
  const alerts = useSelector(state => state.contextGraph.alerts)
  const relations = useSelector(graphRelations)

  useEffect(() => {
    dispatch(regionsFetchRequested())
    dispatch(fetchSitesRequested(account))
    dispatch(defaultAlertsFetchRequested(account))
  }, [dispatch, account])

  useEffect(() => {
    if (
      sites &&
      sites.length > 0 &&
      (!globalSelectedSite || !find(sites, { slug: globalSelectedSite }))
    ) {
      setGlobalSelectedSite(sites[0].slug)
    }
  }, [dispatch, sites])

  useEffect(() => {
    if (globalSelectedSite) {
      dispatch(
        defaultSecurityProfilesFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
    }
  }, [globalSelectedSite, dispatch, account, sites])

  useEffect(() => {
    if (globalSelectedSite !== null) {
      dispatch(
        securityProfilesFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
          status: ['active', 'disabled'],
        }),
      )
      dispatch(
        regionsFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
      dispatch(
        streamsBySiteFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
    }
  }, [dispatch, account, globalSelectedSite])

  useEffect(() => {
    if (globalSelectedSite && activeProfile) {
      if (isNumber(activeProfile.id)) {
        dispatch(
          alertsFetchRequested({
            accountSlug: account,
            siteSlug: globalSelectedSite,
            securityProfileId: activeProfile.id,
          }),
        )
      } else {
        dispatch(alertsFetchSucceeded(activeProfile.alerts))
      }
    }
  }, [globalSelectedSite, activeProfile, dispatch, account])

  const toolbarGridSize = isDeployOpen ? 6 : 3
  const mainGridSize = 12 - toolbarGridSize

  return (
    <Grid container className={classes.root} id='context-graph-root'>
      {loading && <LinearProgress className={classes.loadingProgress} />}
      {!isMobileOnly && (
        <Grid
          item
          lg={mainGridSize}
          md={mainGridSize}
          sm={mainGridSize}
          xs={mainGridSize}
        >
          <Grid
            container
            className={clsx(classes.maxHeight, classes.blackBackground)}
          >
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <ContextGraphProfileSelector />
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              xs={12}
              sm={12}
              className={classes.maxHeight}
            >
              <GraphV2
                regions={regions}
                alerts={alerts}
                relations={relations}
              />
            </Grid>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <SecurityPosturePanel />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid
        item
        lg={isMobileOnly ? 12 : toolbarGridSize}
        md={isMobileOnly ? 12 : toolbarGridSize}
        sm={isMobileOnly ? 12 : toolbarGridSize}
        xs={isMobileOnly ? 12 : toolbarGridSize}
        className={classes.maxHeight}
      >
        {isMobileOnly && (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <ContextGraphProfileSelector />
          </Grid>
        )}
        <ContextGraphToolbar />
      </Grid>
      <Can I='view' on='InternalAdmin'>
        <Can I='update' on='ContextGraph'>
          <ContextGraphAuditViewPanel
            siteSlug={globalSelectedSite}
            siteName={get(
              find(sites, ['slug', globalSelectedSite]),
              'name',
              '',
            )}
          />
        </Can>
      </Can>
    </Grid>
  )
}

export default ContextGraph
