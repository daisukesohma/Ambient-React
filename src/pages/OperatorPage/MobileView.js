import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { batch, useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { useParams } from 'react-router-dom'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
import get from 'lodash/get'
import find from 'lodash/find'
import map from 'lodash/map'
import CheckinModal from 'features/EnhancedResponder/CheckinModal'
import {
  setCheckinModalOpen,
  fetchContactResourcesRequested,
} from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'
import { updateLastWorkShift } from 'redux/slices/auth'
import { createNotification } from 'redux/slices/notifications'
import NewsFeed from 'components/NewsFeed'
import { Can } from 'rbac'

import useStyles from './styles'
import SecurityProfileSelector from './components/SecurityProfileSelector'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import { MixPanelEventEnum } from 'enums'

const defaultSite = {
  value: null,
  label: 'Select Site to Override Profile',
}

const MobileView = () => {
  const { palette } = useTheme()
  const { account } = useParams()
  const classes = useStyles({ isMobile: true })
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const sites = useSelector(state => get(state, 'operatorPage.sites', []))
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()
  const currentUser = useSelector(state => state.auth.profile)
  const usersLoading = useSelector(state => state.checkinModal.usersLoading)
  const sitesLoading = useSelector(state => state.checkinModal.sitesLoading)
  const contactResourcesLoading = useSelector(
    state => state.checkinModal.contactResourcesLoading,
  )
  const [siteOptions, setSiteOptions] = useState([defaultSite])
  const [selectedSiteOption, setSelectedSiteOption] = useState(defaultSite)

  useEffect(() => {
    const newSiteOptions = map(sites, ({ slug, name }) => ({
      value: slug,
      label: name,
    }))

    newSiteOptions.unshift(defaultSite)

    setSiteOptions(newSiteOptions)
  }, [sites])

  useEffect(() => {
    setSelectedSiteOption(find(siteOptions, { value: globalSelectedSite }))
  }, [globalSelectedSite, siteOptions])

  const handleSiteSelect = option => {
    setGlobalSelectedSite(option.value)
  }

  const renderNewsFeed = () => {
    return (
      <Grid item lg={12} md={12} sm={12} xs={12} className={classes.maximized}>
        <NewsFeed operatorPage={false} />
      </Grid>
    )
  }

  useMixpanel(MixPanelEventEnum.LIVE_ENTER)
  useEffect(() => {
    batch(() => {
      dispatch(fetchContactResourcesRequested({ accountSlug: account }))
    })
    return function cleanup() {
      trackEventToMixpanel(MixPanelEventEnum.LIVE_EXIT)
    }
  }, [account, dispatch])

  useEffect(() => {
    const userLastWorkShiftId = sites.findIndex(existingSite => {
      const { activeWorkShiftPeriods } = existingSite
      return (
        activeWorkShiftPeriods.findIndex(
          workShiftPeriod =>
            get(workShiftPeriod, 'profile.id') === get(currentUser, 'id'),
        ) !== -1
      )
    })
    if (userLastWorkShiftId !== -1) {
      const lastWorkShiftPeriod = sites[
        userLastWorkShiftId
      ].activeWorkShiftPeriods.find(
        workShiftPeriod =>
          get(workShiftPeriod, 'profile.id') === get(currentUser, 'id'),
      )
      dispatch(
        updateLastWorkShift({
          data: {
            createOrEndWorkShift: {
              workShiftPeriod: lastWorkShiftPeriod,
            },
          },
          signIn: true,
        }),
      )
    } else {
      dispatch(
        updateLastWorkShift({
          data: {
            createOrEndWorkShift: {
              workShiftPeriod: null,
            },
          },
          signIn: false,
        }),
      )
    }
  }, [dispatch, currentUser, sites])

  const handleCheckIn = () => {
    if (usersLoading || contactResourcesLoading || sitesLoading) {
      dispatch(createNotification({ message: 'Loading...' }))
      return
    }
    const onGoingWorkShift =
      get(currentUser, 'lastWorkShiftPeriod') !== null &&
      get(currentUser, 'lastWorkShiftPeriod.endWorkShift') === null

    const contactResourceId =
      get(currentUser, 'lastWorkShiftPeriod.contactResource.id', null) === null
        ? null
        : parseInt(
            get(currentUser, 'lastWorkShiftPeriod.contactResource.id'),
            10,
          )

    if (currentUser) {
      dispatch(
        setCheckinModalOpen({
          checkinModalOpen: true,
          responderReadOnly: true,
          responderId: get(currentUser, 'id', null),
          contactResourceId: onGoingWorkShift ? contactResourceId : null,
          siteSlug: onGoingWorkShift
            ? get(currentUser, 'lastWorkShiftPeriod.site.slug')
            : null,
        }),
      )
    }
  }

  return (
    <Grid container className={classes.dashboardContainer}>
      <Grid
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className={classes.dashboardMain}
      >
        <Grid container className={classes.dashboardTopBar}>
          <Grid className={classes.mobileSecurity}>
            <SearchableSelectDropdown
              classOverride={classes.mobileSiteSelector}
              styles={{
                marginLeft: 0,
                width: '100%',
                boxSizing: 'border-box',
              }}
              options={siteOptions}
              value={selectedSiteOption || defaultSite}
              onChange={handleSiteSelect}
            />
            <SecurityProfileSelector />
          </Grid>
        </Grid>
        {renderNewsFeed()}
        <div className={classes.checkInOutBar}>
          <div
            style={{
              backgroundColor: darkMode
                ? palette.grey[900]
                : palette.primary.main,
              cursor: 'pointer',
            }}
          >
            <Can I='create' on='WorkShifts'>
              <Button
                fullWidth
                onClick={handleCheckIn}
                variant='text'
                color='primary'
                customStyle={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 0,
                }}
                loading={
                  usersLoading || sitesLoading || contactResourcesLoading
                }
                disabled={
                  usersLoading || sitesLoading || contactResourcesLoading
                }
              >
                Check in
              </Button>
            </Can>
          </div>
        </div>
      </Grid>
      <CheckinModal noButton mobile />
    </Grid>
  )
}

export default MobileView
