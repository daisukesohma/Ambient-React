import React, { useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
// src
import { SettingsSliceProps } from 'redux/slices/settings'

import {
  campaignsFetchRequested,
  allCampaignsFetchRequested,
  fetchAllThreatSignaturesRequested,
} from './redux/dataInfraSlice'
import { INIT_LIMIT } from './constants'
import TopBar from './components/TopBar'
import DataPointsPanel from './components/DataPointsPanel'
import CampaignsPanel from './components/CampaignsPanel'
import AnnotationModal from './components/DataPointsPanel/DataPointsContainer/AnnotationContainer'
import useStyles from './styles'

export default function DataInfra(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })
  // Get campaign data
  useEffect(() => {
    batch(() => {
      dispatch(campaignsFetchRequested({ page: 1, limit: INIT_LIMIT }))
      dispatch(allCampaignsFetchRequested({}))
      dispatch(fetchAllThreatSignaturesRequested())
    })
  }, [dispatch])

  return (
    <div className={classes.container}>
      <TopBar />
      <div className={classes.mainPanel}>
        <DataPointsPanel />
      </div>
      <div className={classes.bottomPanel}>
        <CampaignsPanel />
      </div>
      <div>
        <AnnotationModal />
      </div>
    </div>
  )
}
